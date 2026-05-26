using System.Threading.RateLimiting;
using FluentValidation;
using Fulda.API.Middleware;
using Fulda.Application.Validators;
using Fulda.Infrastructure;
using Fulda.Infrastructure.Data;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/fulda-.log", rollingInterval: RollingInterval.Day));

    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddValidatorsFromAssemblyContaining<CreateReservationValidator>();

    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Fulda API",
            Version = "v1",
            Description = "Am Stockhaus restaurant API"
        });

        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme.",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                Array.Empty<string>()
            }
        });
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
        {
            var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:5173", "http://localhost:3000"];

            policy.WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                }));
    });

    builder.Services.AddScoped<DatabaseSeeder>();

    var app = builder.Build();

    app.UseMiddleware<ExceptionHandlingMiddleware>();
    app.UseSerilogRequestLogging();

    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseHttpsRedirection();
    app.UseCors("Frontend");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    var spaPath = Path.Combine(app.Environment.ContentRootPath, "spa");
    if (Directory.Exists(spaPath) && File.Exists(Path.Combine(spaPath, "index.html")))
    {
        var spaFiles = new PhysicalFileProvider(spaPath);
        app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = spaFiles });
        app.UseStaticFiles(new StaticFileOptions { FileProvider = spaFiles });
        Log.Information("Serving website from {SpaPath}", spaPath);
    }

    app.MapControllers();

    if (Directory.Exists(spaPath) && File.Exists(Path.Combine(spaPath, "index.html")))
    {
        app.MapFallbackToFile("index.html", new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(spaPath)
        });
    }
    else if (app.Environment.IsProduction())
    {
        Log.Warning("SPA folder not found at {SpaPath}. Push to main to deploy the website with the API.", spaPath);
    }

    var sqlFactory = app.Services.GetRequiredService<ISqlConnectionFactory>();
    if (!sqlFactory.IsConfigured)
    {
        Log.Warning(
            "ConnectionStrings__DefaultConnection is missing in Azure. " +
            "Add it under flaudaa → Environment variables → App settings, then Save and Restart. " +
            "Check /api/health after deploy.");
    }
    else
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
            await seeder.SeedAdminUserAsync();
            Log.Information("Admin user seed completed.");
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Could not seed admin user. Check SQL firewall, managed identity, and Entra access.");
        }
    }

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

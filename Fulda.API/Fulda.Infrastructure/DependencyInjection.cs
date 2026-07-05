using System.Text;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Application.Interfaces.Services;
using Fulda.Application.Services;
using Fulda.Infrastructure.Auth;
using Fulda.Infrastructure.Data;
using Fulda.Infrastructure.Options;
using Fulda.Infrastructure.Repositories;
using Fulda.Infrastructure.Services;
using Fulda.Infrastructure.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Fulda.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.Configure<BlobStorageSettings>(configuration.GetSection(BlobStorageSettings.SectionName));

        services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
        services.AddScoped<IReservationRepository, ReservationRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IWineRepository, WineRepository>();
        services.AddScoped<IStaffRepository, StaffRepository>();
        services.AddScoped<ISiteImageRepository, SiteImageRepository>();
        services.AddScoped<IAdminUserRepository, AdminUserRepository>();

        services.AddScoped<ReservationService>();
        services.AddScoped<MenuService>();
        services.AddScoped<WineService>();
        services.AddScoped<StaffService>();
        services.AddScoped<SiteImageService>();

        services.AddSingleton<JwtTokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IBlobStorageService, BlobStorageService>();

        var jwt = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
            ?? new JwtSettings();

        var jwtSecret = jwt.Secret;
        if (string.IsNullOrWhiteSpace(jwtSecret))
        {
            // Lets the app start so /api/health can report missing Jwt__Secret
            jwtSecret = "FuldaConfigureJwtSecretInAzurePortalMin32Chars!";
            jwt.Secret = jwtSecret;
        }

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwt.Issuer,
                    ValidAudience = jwt.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ClockSkew = TimeSpan.FromMinutes(1)
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            context.Token = accessToken;
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        return services;
    }
}

using Fulda.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ISqlConnectionFactory _sql;
    private readonly IConfiguration _configuration;

    public HealthController(ISqlConnectionFactory sql, IConfiguration configuration)
    {
        _sql = sql;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var hasConnectionString = _sql.IsConfigured;
        var hasJwt = !string.IsNullOrWhiteSpace(_configuration["Jwt:Secret"]);
        var dbOk = false;
        string? dbError = null;

        if (hasConnectionString)
        {
            try
            {
                using var connection = _sql.CreateConnection();
                connection.Open();
                dbOk = true;
            }
            catch (Exception ex)
            {
                dbError = ex.Message;
            }
        }

        string? hint = null;
        if (!hasConnectionString)
            hint = "Add ConnectionStrings__DefaultConnection in flaudaa (Azure SQL, not LocalDB). Save and Restart.";
        else if (!hasJwt)
            hint = "Add Jwt__Secret in flaudaa → Environment variables → Save → Restart.";
        else if (!dbOk && dbError?.Contains("LocalDB", StringComparison.OrdinalIgnoreCase) == true)
            hint = "Azure is using LocalDB. Set ASPNETCORE_ENVIRONMENT=Production and ConnectionStrings__DefaultConnection to your Azure SQL string on flaudaa.";
        else if (!dbOk)
            hint = "SQL unreachable. Check firewall, managed identity user [flaudaa], and connection string on flaudaa.";

        return Ok(new
        {
            status = hasConnectionString && hasJwt && dbOk ? "healthy" : "needs_configuration",
            connectionStringConfigured = hasConnectionString,
            connectionSource = _sql.ConnectionSource,
            jwtConfigured = hasJwt,
            databaseReachable = dbOk,
            databaseError = dbError,
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                ?? Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT"),
            hint
        });
    }
}

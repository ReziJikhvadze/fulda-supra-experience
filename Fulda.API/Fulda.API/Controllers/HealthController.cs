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

        return Ok(new
        {
            status = hasConnectionString && hasJwt && dbOk ? "healthy" : "needs_configuration",
            connectionStringConfigured = hasConnectionString,
            jwtConfigured = hasJwt,
            databaseReachable = dbOk,
            databaseError = dbError,
            hint = !hasConnectionString
                ? "Add ConnectionStrings__DefaultConnection in flaudaa → Environment variables → Save → Restart"
                : !hasJwt
                    ? "Add Jwt__Secret in flaudaa → Environment variables → Save → Restart"
                    : null
        });
    }
}

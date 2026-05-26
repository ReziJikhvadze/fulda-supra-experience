using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Fulda.Infrastructure.Data;

public interface ISqlConnectionFactory
{
    bool IsConfigured { get; }
    string? ConnectionSource { get; }
    IDbConnection CreateConnection();
}

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string? _connectionString;
    private readonly string? _connectionSource;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        (_connectionString, _connectionSource) = ResolveConnectionString(configuration);
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_connectionString);

    public string? ConnectionSource => _connectionSource;

    public IDbConnection CreateConnection()
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException(
                "Database is not configured. On flaudaa add Connection string name DefaultConnection " +
                "or App setting ConnectionStrings__DefaultConnection, then Save and Restart.");
        }

        return new SqlConnection(_connectionString);
    }

    private static (string? ConnectionString, string? Source) ResolveConnectionString(IConfiguration configuration)
    {
        var fromConfig = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(fromConfig))
            return (fromConfig.Trim(), "configuration");

        // Azure App Service → Connection strings tab (type SQLAzure)
        var sqlAzure = Environment.GetEnvironmentVariable("SQLCONNSTR_DefaultConnection");
        if (!string.IsNullOrWhiteSpace(sqlAzure))
            return (sqlAzure.Trim(), "SQLCONNSTR_DefaultConnection");

        var custom = Environment.GetEnvironmentVariable("CUSTOMCONNSTR_DefaultConnection");
        if (!string.IsNullOrWhiteSpace(custom))
            return (custom.Trim(), "CUSTOMCONNSTR_DefaultConnection");

        // Azure App Service → Application settings
        var appSetting = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        if (!string.IsNullOrWhiteSpace(appSetting))
            return (appSetting.Trim(), "ConnectionStrings__DefaultConnection");

        return (null, null);
    }
}

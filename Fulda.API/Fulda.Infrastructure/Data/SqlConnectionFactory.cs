using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Fulda.Infrastructure.Data;

public interface ISqlConnectionFactory
{
    IDbConnection CreateConnection();
}

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is not configured. " +
                "In Azure App Service (flaudaa), set Application setting or Connection string: " +
                "ConnectionStrings__DefaultConnection.");
        }

        _connectionString = connectionString;
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}

using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Fulda.Infrastructure.Data;

public interface ISqlConnectionFactory
{
    bool IsConfigured { get; }
    IDbConnection CreateConnection();
}

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string? _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(_connectionString))
            _connectionString = null;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_connectionString);

    public IDbConnection CreateConnection()
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException(
                "Database is not configured. In Azure (flaudaa), add Application setting " +
                "ConnectionStrings__DefaultConnection, then Save and Restart.");
        }

        return new SqlConnection(_connectionString);
    }
}

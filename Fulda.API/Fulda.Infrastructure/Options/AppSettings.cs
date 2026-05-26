namespace Fulda.Infrastructure.Options;

public class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "Fulda.API";
    public string Audience { get; set; } = "Fulda.Admin";
    public int ExpirationMinutes { get; set; } = 480;
}

public class BlobStorageSettings
{
    public const string SectionName = "AzureStorage";

    public string ConnectionString { get; set; } = string.Empty;
    public string ContainerName { get; set; } = "fulda-images";
    public long MaxFileSizeBytes { get; set; } = 5 * 1024 * 1024;
}

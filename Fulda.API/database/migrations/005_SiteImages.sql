-- Homepage section images stored as base64 data URLs (no blob storage required).
-- Keys: intro = khinkali section, story = dining room section.

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'SiteImages')
BEGIN
    CREATE TABLE SiteImages (
        [Key]       NVARCHAR(50)  NOT NULL PRIMARY KEY,
        ImageData   NVARCHAR(MAX) NULL,
        UpdatedAt   DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM SiteImages WHERE [Key] = N'intro')
    INSERT INTO SiteImages ([Key], ImageData) VALUES (N'intro', NULL);
GO

IF NOT EXISTS (SELECT 1 FROM SiteImages WHERE [Key] = N'story')
    INSERT INTO SiteImages ([Key], ImageData) VALUES (N'story', NULL);
GO

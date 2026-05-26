-- Fulda Restaurant Database - Initial Schema
-- Run against SQL Server (LocalDB, Azure SQL, or full instance)

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Reservations')
BEGIN
    CREATE TABLE Reservations (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CustomerName    NVARCHAR(80)  NOT NULL,
        Email           NVARCHAR(120) NOT NULL,
        Phone           NVARCHAR(30)  NOT NULL,
        ReservationDate DATE          NOT NULL,
        ReservationTime TIME          NOT NULL,
        GuestCount      INT           NOT NULL,
        SpecialRequest  NVARCHAR(500) NULL,
        Status          INT           NOT NULL DEFAULT 0,
        CreatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT CK_Reservations_GuestCount CHECK (GuestCount BETWEEN 1 AND 20),
        CONSTRAINT CK_Reservations_Status CHECK (Status IN (0, 1, 2))
    );

    CREATE INDEX IX_Reservations_Date ON Reservations (ReservationDate);
    CREATE INDEX IX_Reservations_Status ON Reservations (Status);
    CREATE INDEX IX_Reservations_Email ON Reservations (Email);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MenuCategories')
BEGIN
    CREATE TABLE MenuCategories (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(100) NOT NULL,
        DisplayOrder INT           NOT NULL DEFAULT 0,
        IsActive     BIT           NOT NULL DEFAULT 1
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MenuItems')
BEGIN
    CREATE TABLE MenuItems (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        CategoryId   INT            NOT NULL,
        Name         NVARCHAR(150)  NOT NULL,
        Description  NVARCHAR(500)  NULL,
        Price        DECIMAL(10,2)  NOT NULL,
        ImageUrl     NVARCHAR(500)  NULL,
        IsAvailable  BIT            NOT NULL DEFAULT 1,
        DisplayOrder INT            NOT NULL DEFAULT 0,
        CONSTRAINT FK_MenuItems_Category FOREIGN KEY (CategoryId) REFERENCES MenuCategories(Id) ON DELETE CASCADE
    );

    CREATE INDEX IX_MenuItems_CategoryId ON MenuItems (CategoryId);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'WineCategories')
BEGIN
    CREATE TABLE WineCategories (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(100) NOT NULL,
        DisplayOrder INT           NOT NULL DEFAULT 0
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Wines')
BEGIN
    CREATE TABLE Wines (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        CategoryId  INT            NOT NULL,
        Name        NVARCHAR(150)  NOT NULL,
        Description NVARCHAR(500)  NULL,
        Price       DECIMAL(10,2)  NOT NULL,
        Country     NVARCHAR(100)  NULL,
        Year        INT            NULL,
        ImageUrl    NVARCHAR(500)  NULL,
        IsAvailable BIT            NOT NULL DEFAULT 1,
        CONSTRAINT FK_Wines_Category FOREIGN KEY (CategoryId) REFERENCES WineCategories(Id) ON DELETE CASCADE
    );

    CREATE INDEX IX_Wines_CategoryId ON Wines (CategoryId);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'StaffMembers')
BEGIN
    CREATE TABLE StaffMembers (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        FullName     NVARCHAR(120) NOT NULL,
        Position     NVARCHAR(100) NOT NULL,
        Bio          NVARCHAR(1000) NULL,
        ImageUrl     NVARCHAR(500)  NULL,
        DisplayOrder INT            NOT NULL DEFAULT 0,
        IsActive     BIT            NOT NULL DEFAULT 1
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AdminUsers')
BEGIN
    CREATE TABLE AdminUsers (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Username     NVARCHAR(50)  NOT NULL UNIQUE,
        PasswordHash NVARCHAR(200) NOT NULL,
        Email        NVARCHAR(120) NOT NULL,
        Role         NVARCHAR(50)  NOT NULL DEFAULT 'Admin',
        IsActive     BIT           NOT NULL DEFAULT 1
    );
END
GO

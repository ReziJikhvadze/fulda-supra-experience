-- Signature Plates section (homepage grid) — edit in Admin → Menu → "Signature Plates"

IF NOT EXISTS (SELECT 1 FROM MenuCategories WHERE Name = N'Signature Plates')
BEGIN
    DECLARE @CatId INT;

    INSERT INTO MenuCategories (Name, DisplayOrder, IsActive)
    VALUES (N'Signature Plates', 0, 1);

    SET @CatId = SCOPE_IDENTITY();

    INSERT INTO MenuItems (CategoryId, Name, Description, Price, IsAvailable, DisplayOrder) VALUES
    (@CatId, N'Adjaruli Khachapuri', N'Boat-shaped bread with egg and butter.', 14.50, 1, 1),
    (@CatId, N'Beef Khinkali', N'Handmade dumplings with spiced beef.', 16.00, 1, 2),
    (@CatId, N'Mtsvadi', N'Georgian pork skewers with tkemali.', 22.00, 1, 3),
    (@CatId, N'Lobio', N'Red bean stew with herbs.', 13.50, 1, 4),
    (@CatId, N'Pkhali', N'Spinach and walnut pate with pomegranate.', 11.50, 1, 5),
    (@CatId, N'Badrijani', N'Fried eggplant rolls with walnut paste.', 12.50, 1, 6),
    (@CatId, N'Georgian Salad', N'Tomatoes, cucumber, walnuts, herbs.', 10.00, 1, 7),
    (@CatId, N'Churchkhela', N'Grape must and nut candle.', 6.50, 1, 8);
END
GO

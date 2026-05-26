-- Seed data for Am Stockhaus
-- Default admin: username=admin, password=Admin123!

IF NOT EXISTS (SELECT 1 FROM AdminUsers WHERE Username = 'admin')
BEGIN
    -- Admin user is seeded at application startup with BCrypt hash (username: admin, password: Admin123!)
    -- See Fulda.Infrastructure.Data.DatabaseSeeder
    SELECT 1;
END
GO

IF NOT EXISTS (SELECT 1 FROM MenuCategories)
BEGIN
    SET IDENTITY_INSERT MenuCategories ON;
    INSERT INTO MenuCategories (Id, Name, DisplayOrder, IsActive) VALUES
    (1, 'Starters', 1, 1),
    (2, 'Khachapuri', 2, 1),
    (3, 'Khinkali', 3, 1),
    (4, 'Mains', 4, 1),
    (5, 'Vegetarian', 5, 1),
    (6, 'Desserts', 6, 1),
    (7, 'Drinks', 7, 1);
    SET IDENTITY_INSERT MenuCategories OFF;

    INSERT INTO MenuItems (CategoryId, Name, Description, Price, IsAvailable, DisplayOrder) VALUES
    (1, 'Pkhali', 'Spinach and walnut pate with pomegranate.', 11.50, 1, 1),
    (1, 'Badrijani', 'Fried eggplant rolls with walnut paste.', 12.50, 1, 2),
    (1, 'Georgian Salad', 'Tomatoes, cucumber, walnuts, herbs.', 10.00, 1, 3),
    (1, 'Lobio Starter', 'Warm kidney bean stew with spices.', 12.00, 1, 4),
    (2, 'Adjaruli Khachapuri', 'Boat-shaped bread with egg and butter.', 14.50, 1, 1),
    (2, 'Imeruli Khachapuri', 'Round cheese bread from Imereti.', 12.50, 1, 2),
    (2, 'Megruli Khachapuri', 'Double cheese khachapuri.', 15.00, 1, 3),
    (3, 'Beef Khinkali', 'Handmade dumplings with spiced beef.', 2.20, 1, 1),
    (3, 'Lamb Khinkali', 'Handmade dumplings with lamb.', 2.50, 1, 2),
    (3, 'Mushroom Khinkali', 'Handmade dumplings with mushrooms.', 2.00, 1, 3),
    (4, 'Mtsvadi', 'Georgian pork skewers with tkemali.', 22.00, 1, 1),
    (4, 'Chakapuli', 'Lamb stew with tarragon and white wine.', 24.00, 1, 2),
    (4, 'Ojakhuri', 'Pan-fried pork with potatoes and onions.', 19.50, 1, 3),
    (4, 'Shkmeruli', 'Chicken in garlic cream sauce.', 21.00, 1, 4),
    (5, 'Ajapsandali', 'Georgian ratatouille with eggplant.', 15.00, 1, 1),
    (5, 'Lobio', 'Red bean stew with herbs.', 13.50, 1, 2),
    (6, 'Churchkhela', 'Grape must and nut candle.', 6.50, 1, 1),
    (6, 'Pelamushi', 'Grape pudding with walnuts.', 7.00, 1, 2),
    (6, 'Honey Cake', 'Layered honey sponge cake.', 7.50, 1, 3),
    (7, 'Borjomi', 'Georgian mineral water.', 4.50, 1, 1),
    (7, 'Tarkhuna', 'Tarragon lemonade.', 4.00, 1, 2),
    (7, 'Chacha', 'Georgian grape brandy.', 5.50, 1, 3),
    (7, 'Georgian Tea', 'Black tea with herbs.', 3.50, 1, 4);
END
GO

IF NOT EXISTS (SELECT 1 FROM WineCategories)
BEGIN
    SET IDENTITY_INSERT WineCategories ON;
    INSERT INTO WineCategories (Id, Name, DisplayOrder) VALUES
    (1, 'Red Wines', 1),
    (2, 'White Wines', 2),
    (3, 'Semi-Sweet', 3);
    SET IDENTITY_INSERT WineCategories OFF;

    INSERT INTO Wines (CategoryId, Name, Description, Price, Country, Year, IsAvailable) VALUES
    (1, 'Saperavi', 'Full-bodied red from Kakheti. (Glass)', 8.50, 'Georgia', 2021, 1),
    (1, 'Mukuzani Reserve', 'Aged Saperavi, deep and structured. (Glass)', 11.00, 'Georgia', 2019, 1),
    (2, 'Rkatsiteli', 'Crisp amber white wine. (Glass)', 9.50, 'Georgia', 2022, 1),
    (3, 'Kindzmarauli', 'Semi-sweet red from Kakheti. (Glass)', 8.50, 'Georgia', 2021, 1);
END
GO

IF NOT EXISTS (SELECT 1 FROM StaffMembers)
BEGIN
    INSERT INTO StaffMembers (FullName, Position, Bio, DisplayOrder, IsActive) VALUES
    ('Nino Kvaratskhelia', 'Head Chef', 'Bringing authentic Tbilisi flavors to Fulda since 2018.', 1, 1),
    ('Giorgi Beridze', 'Sommelier', 'Curator of our Georgian wine cellar and qvevri selections.', 2, 1);
END
GO

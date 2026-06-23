-- 004 Menu translations (DE / KA) + reseed of the full trilingual menu.
-- Base columns Name/Description hold ENGLISH; *De and *Ka hold the translations.
-- Run after 001-003. Safe to run multiple times (idempotent column add; reseed
-- replaces all NON "Signature Plates" categories with the current trilingual menu).

------------------------------------------------------------------------------
-- 1) Add translation columns (idempotent)
------------------------------------------------------------------------------
IF COL_LENGTH('MenuCategories', 'NameDe') IS NULL
    ALTER TABLE MenuCategories ADD NameDe NVARCHAR(100) NULL;
GO
IF COL_LENGTH('MenuCategories', 'NameKa') IS NULL
    ALTER TABLE MenuCategories ADD NameKa NVARCHAR(100) NULL;
GO
IF COL_LENGTH('MenuItems', 'NameDe') IS NULL
    ALTER TABLE MenuItems ADD NameDe NVARCHAR(150) NULL;
GO
IF COL_LENGTH('MenuItems', 'NameKa') IS NULL
    ALTER TABLE MenuItems ADD NameKa NVARCHAR(150) NULL;
GO
IF COL_LENGTH('MenuItems', 'DescriptionDe') IS NULL
    ALTER TABLE MenuItems ADD DescriptionDe NVARCHAR(500) NULL;
GO
IF COL_LENGTH('MenuItems', 'DescriptionKa') IS NULL
    ALTER TABLE MenuItems ADD DescriptionKa NVARCHAR(500) NULL;
GO

------------------------------------------------------------------------------
-- 2) Reseed the public menu (all categories except "Signature Plates")
------------------------------------------------------------------------------
BEGIN TRANSACTION;

DELETE FROM MenuItems
WHERE CategoryId IN (SELECT Id FROM MenuCategories WHERE Name <> N'Signature Plates');

DELETE FROM MenuCategories WHERE Name <> N'Signature Plates';

DECLARE @starters INT, @dough INT, @khinkali INT, @mains INT, @sides INT, @desserts INT, @drinks INT;

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Starters', N'Vorspeisen', N'წინაკერძი', 1, 1);
SET @starters = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Khachapuri', N'Teiggerichte', N'ხაჭაპური', 2, 1);
SET @dough = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Khinkali', N'Khinkali', N'ხინკალი', 3, 1);
SET @khinkali = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Main Dishes', N'Hauptgerichte', N'ცხელი კერძები', 4, 1);
SET @mains = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Sides & Sauces', N'Beilagen und Saucen', N'გარნირი და სოუსები', 5, 1);
SET @sides = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Desserts', N'Desserts', N'დესერტი', 6, 1);
SET @desserts = SCOPE_IDENTITY();

INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
VALUES (N'Drinks', N'Getränke', N'სასმელი', 7, 1);
SET @drinks = SCOPE_IDENTITY();

-- Starters ------------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@starters, N'Vegetable Soup', N'Gemüsesuppe', N'ბოსტნეულის სუპი', N'Seasonal vegetables in a light, house-made broth.', N'Saisonales Gemüse in einer leichten, hausgemachten Brühe.', N'სეზონური ბოსტნეული მსუბუქ, სახლის ნახარშში.', 7.00, 1, 1),
(@starters, N'Kharcho Soup', N'Supp-Kharcho', N'ხარჩო', N'Spicy beef soup enriched with kharcho suneli, a piquant Georgian spice blend.', N'Würzige Rindfleischsuppe, verfeinert mit Kharchos Suneli, einer pikanten georgischen Gewürzmischung.', N'ცხარე საქონლის სუპი ხარჩოს სუნელით.', 9.90, 1, 2),
(@starters, N'Chikhirtma', N'Chikhirtma', N'ჩიხირთმა', N'Traditional Georgian chicken soup with egg, fresh herbs and tender chicken.', N'Traditionelle georgische Hühnersuppe mit Ei, frischen Kräutern und zartem Hähnchenfleisch.', N'ტრადიციული ქართული ქათმის სუპი კვერცხით, ახალი მწვანილითა და ნაზი ქათმის ხორცით.', 8.50, 1, 3),
(@starters, N'Extra Bread Basket', N'Zusätzlicher Brotkorb', N'დამატებითი პურის კალათა', N'Freshly baked stone-oven bread, daily.', N'Täglich frisch gebackenes Brot aus dem Steinofen.', N'ყოველდღიურად გამომცხვარი ქვის ღუმელის პური.', 2.50, 1, 4),
(@starters, N'Georgian Salad', N'Georgischer Salat', N'ქართული სალათი', N'Tomato and cucumber salad with red onion, coriander and parsley.', N'Tomaten-Gurken-Salat mit roten Zwiebeln, Koriander und Petersilie.', N'პომიდვრისა და კიტრის სალათი წითელი ხახვით, ქინძითა და ოხრახუშით.', 7.50, 1, 5),
(@starters, N'Georgian Salad with Walnut', N'Georgischer Salat mit Walnuss', N'ქართული სალათი ნიგვზით', N'Tomato and cucumber salad with red onion, coriander, parsley and walnut-herb paste.', N'Tomaten-Gurken-Salat mit roten Zwiebeln, Koriander, Petersilie und Walnuss-Kräuterpaste.', N'პომიდვრისა და კიტრის სალათი წითელი ხახვით, ქინძით, ოხრახუშითა და ნიგვზის პასტით.', 10.00, 1, 6),
(@starters, N'Georgian-Style Chicken Salad', N'Hähnchensalat nach georgischer Art', N'ქათმის სალათი ქართულად', N'House-made chicken salad, finely seasoned in the Georgian style.', N'Hausgemachter Hähnchensalat, fein abgeschmeckt nach georgischer Art.', N'სახლის ქათმის სალათი, ქართულად დაგემოვნებული.', 14.00, 1, 7),
(@starters, N'Pkhali Spinach', N'Pkhali Spinat', N'ისპანახის ფხალი', N'Steamed spinach with walnut-herb paste, garlic and spices.', N'Gedünsteter Spinat mit Walnuss-Kräuterpaste, verfeinert mit Knoblauch und Gewürzen.', N'მოშუშული ისპანახი ნიგვზის პასტით, ნივრითა და სანელებლებით.', 9.00, 1, 8),
(@starters, N'Pkhali Beetroot', N'Pkhali Rote Bete', N'ჭარხლის ფხალი', N'Steamed beetroot with walnut-herb paste, garlic and spices.', N'Gedünstete Rote Bete mit Walnuss-Kräuterpaste, verfeinert mit Knoblauch und Gewürzen.', N'მოშუშული ჭარხალი ნიგვზის პასტით, ნივრითა და სანელებლებით.', 9.00, 1, 9),
(@starters, N'Pkhali Pumpkin', N'Pkhali Kürbis', N'გოგრის ფხალი', N'Pumpkin with walnut-herb paste, garlic and spices.', N'Kürbis mit Walnuss-Kräuterpaste, verfeinert mit Knoblauch und Gewürzen.', N'გოგრა ნიგვზის პასტით, ნივრითა და სანელებლებით.', 9.00, 1, 10),
(@starters, N'Eggplant Rolls with Walnut', N'Auberginenröllchen mit Walnuss', N'ბადრიჯანი ნიგვზით', N'Fried eggplant rolls filled with walnut-herb paste and garlic.', N'Gebratene Auberginenröllchen, gefüllt mit einer Walnuss-Kräuterpaste, verfeinert mit Knoblauch.', N'შემწვარი ბადრიჯნის რულეტი ნიგვზის პასტითა და ნივრით.', 10.00, 1, 11),
(@starters, N'Pepper Rolls with Walnut', N'Paprikaröllchen mit Walnuss', N'წიწაკა ნიგვზით', N'Roasted pepper rolls filled with walnut-herb paste and Georgian spices.', N'Geröstete Paprikaröllchen, gefüllt mit einer Walnuss-Kräuterpaste und georgischen Gewürzen.', N'შემწვარი წიწაკის რულეტი ნიგვზის პასტითა და ქართული სანელებლებით.', 10.00, 1, 12),
(@starters, N'Pkhali Platter', N'Pkhali-Assorti', N'ფხლეულის ასორტი', N'Cold mixed starter platter for 2 with assorted pkhali, eggplant and pepper walnut rolls.', N'Kalte, gemischte Vorspeisenplatte für 2 Personen mit verschiedenen Pkhali-Sorten, Auberginen- und Paprikaröllchen mit Walnuss.', N'ცივი წინაკერძის ასორტი 2 პერსონაზე — სხვადასხვა ფხალი, ბადრიჯნისა და წიწაკის რულეტი ნიგვზით.', 21.00, 1, 13),
(@starters, N'Gebjalia', N'Gebjalia', N'გებჟალია', N'Savory cheese rolls of house-made mozzarella, filled with fresh nadughi-mint cream and fruity cream sauce.', N'Pikante Käserollen aus hausgemachtem Mozzarella, gefüllt mit frischer Nadughi-Minz-Creme und fruchtiger Sahnesauce.', N'ცხარე ყველის რულეტი სახლის მოცარელადან, ნადუღი-პიტნის კრემითა და ნაღების სოუსით.', 12.50, 1, 14);

-- Khachapuri / Teiggerichte -------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@dough, N'Khachapuri Imeruli', N'Khatchapuri Imeruli', N'იმერული ხაჭაპური', N'Thinly rolled yeast dough filled with cheese.', N'Fein ausgerollter Hefeteig, gefüllt mit Käse.', N'თხლად გაშლილი საფუარის ცომი ყველით.', 14.00, 1, 1),
(@dough, N'Khachapuri Megruli', N'Khatchapuri Megruli', N'მეგრული ხაჭაპური', N'Thinly rolled yeast dough filled and topped with cheese.', N'Fein ausgerollter Hefeteig, gefüllt und überbacken mit Käse.', N'თხლად გაშლილი საფუარის ცომი ყველით, ზემოდანაც ყველით.', 16.00, 1, 2),
(@dough, N'Khachapuri Adjaruli', N'Khatchapuri Adjaruli', N'აჭარული ხაჭაპური', N'Boat-shaped dough with creamy cheese filling, garnished with egg yolk.', N'Schiffchenförmiger Teig mit cremiger Käsefüllung und Eigelb garniert.', N'ნავის ფორმის ცომი ნაზი ყველის გულითა და კვერცხის გულით.', 18.00, 1, 3),
(@dough, N'Lobiani', N'Lobiani', N'ლობიანი', N'Thinly rolled yeast dough filled with spiced bean cream.', N'Fein ausgerollter Hefeteig, gefüllt mit würziger Bohnencreme.', N'თხლად გაშლილი საფუარის ცომი ცხარე ლობიოს გულით.', 14.00, 1, 4),
(@dough, N'Kubdari', N'Kubdari', N'კუბდარი', N'Georgian yeast dough filled with finely chopped beef and pork and Georgian spices.', N'Georgischer Hefeteig, gefüllt mit fein gehacktem Rind- und Schweinefleisch und georgischen Gewürzen.', N'ქართული საფუარის ცომი წვრილად დაჭრილი საქონლისა და ღორის ხორცით და ქართული სანელებლებით.', 18.00, 1, 5),
(@dough, N'Blini', N'Blini', N'ბლინი', N'Rolled pancakes filled with minced beef, garlic and coriander. 5 pieces.', N'Gerollte Pfannkuchen, gefüllt mit Rinderhackfleisch, Knoblauch und Koriander. 5 Stück.', N'გახვეული ბლინი საქონლის ფარშით, ნივრითა და ქინძით. 5 ცალი.', 11.50, 1, 6),
(@dough, N'Shotis Puri', N'Schotis Puri', N'შოთის პური', N'Thin, hand-shaped flatbread, baked fresh on hot stone.', N'Dünnes, handgeformtes Fladenbrot, ofenfrisch auf heißem Stein gebacken.', N'თხელი, ხელით ნაზელი პური, ცხელ ქვაზე გამომცხვარი.', 2.50, 1, 7),
(@dough, N'Mchadi', N'Mchadi', N'მჭადი', N'Traditional Georgian cornbread, lightly crisp outside and soft inside.', N'Traditionelles georgisches Maisbrot, außen leicht knusprig und innen weich.', N'ტრადიციული ქართული სიმინდის პური, გარედან ხრაშუნა და შიგნით რბილი.', 2.50, 1, 8);

-- Khinkali ------------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@khinkali, N'Khinkali with Meat', N'Khinkali mit Fleisch', N'ხინკალი ხორცით', N'1 portion / 4 pieces. Dumplings with a juicy, spiced pork and beef filling.', N'1 Portion / 4 Stück. Teigtaschen mit pikant-saftiger Hackfleischfüllung aus Schweine- und Rindfleisch.', N'1 პორცია / 4 ცალი. ცომის გუნდები წვნიანი ღორ-საქონლის ფარშით.', 13.20, 1, 1),
(@khinkali, N'Khinkali with Cheese', N'Khinkali mit Käse', N'ხინკალი ყველით', N'1 portion / 4 pieces. Dumplings with a soft cheese filling.', N'1 Portion / 4 Stück. Teigtaschen mit einer Weichkäsefüllung.', N'1 პორცია / 4 ცალი. ცომის გუნდები რბილი ყველის გულით.', 12.00, 1, 2);

-- Main Dishes ---------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@mains, N'Adjapsandali', N'Adjapsandali', N'აჯაფსანდალი', N'Braised vegetable stew of eggplant, potatoes and select vegetables.', N'Geschmorter Gemüseeintopf aus Auberginen, Kartoffeln und feiner Gemüseauswahl.', N'მოშუშული ბოსტნეულის კერძი ბადრიჯნით, კარტოფილითა და ბოსტნეულით.', 10.50, 1, 1),
(@mains, N'Sazivi', N'Sazivi', N'საცივი', N'Tender turkey in creamy walnut sauce with garlic and Georgian spices.', N'Zartes Putenfleisch in cremiger Walnuss-Sauce mit Knoblauch und georgischen Gewürzen.', N'ნაზი ინდაურის ხორცი ნიგვზის ნაღების სოუსში ნივრითა და ქართული სანელებლებით.', 16.00, 1, 2),
(@mains, N'Lobio', N'Lobio', N'ლობიო', N'Red bean stew served with tangy pickled vegetables.', N'Bohneneintopf aus roten Bohnen, begleitet von würzig-sauer eingelegtem Gemüse.', N'წითელი ლობიოს კერძი მწნილებთან ერთად.', 14.00, 1, 3),
(@mains, N'Chkmeruli', N'Chkmeruli', N'შქმერული', N'Marinated young chicken roasted whole on the bone, served in a rich garlic-cream sauce.', N'Mariniertes, junges Maishähnchen im Ganzen am Knochen gebraten, serviert in einer deftigen Knoblauch-Sahne-Sauce.', N'მარინადში ჩაწყობილი ახალგაზრდა ქათამი მთლიანად შემწვარი, ნივრიან-ნაღების სოუსში.', 20.50, 1, 4),
(@mains, N'Tabaka', N'Tabaka', N'ტაბაკა', N'Marinated half young chicken roasted on the bone, served with a selection of vegetables.', N'Mariniertes, halbes junges Hähnchen am Knochen gebraten, dazu eine Gemüseauswahl.', N'მარინადში ჩაწყობილი ნახევარი ქათამი ძვალზე შემწვარი, ბოსტნეულის გარნირით.', 18.50, 1, 5),
(@mains, N'Odjakhuri', N'Odjakhuri', N'ოჯახური', N'Pan-fried pork with potatoes, coriander and fried onions.', N'Schweinefleisch aus der Pfanne mit Kartoffeln, Koriander und gebratenen Zwiebeln.', N'ღორის ხორცი ტაფაში კარტოფილით, ქინძითა და შემწვარი ხახვით.', 19.00, 1, 6),
(@mains, N'Chakapuli', N'Chakapuli', N'ჩაქაფული', N'Traditional Georgian lamb stew with tarragon, fresh herbs and a delicate sour note.', N'Traditioneller georgischer Lammeintopf mit Estragon, frischen Kräutern und einer fein säuerlichen Note.', N'ტრადიციული ქართული ცხვრის კერძი ტარხუნით, ახალი მწვანილითა და მჟავე ნოტით.', 25.00, 1, 7),
(@mains, N'Mtsvadi Chicken', N'Mzwadi vom Hähnchen', N'ქათმის მწვადი', N'Grilled skewers, 200 g.', N'Gegrillte Spieße, 200 g.', N'შემწვარი მწვადი, 200 გ.', 16.50, 1, 8),
(@mains, N'Mtsvadi Pork', N'Mzwadi vom Schwein', N'ღორის მწვადი', N'Grilled skewers, 250 g.', N'Gegrillte Spieße, 250 g.', N'შემწვარი მწვადი, 250 გ.', 17.00, 1, 9),
(@mains, N'Mtsvadi Veal', N'Mzwadi vom Kalb', N'ხბოს მწვადი', N'Grilled skewers, 250 g.', N'Gegrillte Spieße, 250 g.', N'შემწვარი მწვადი, 250 გ.', 19.50, 1, 10),
(@mains, N'Mtsvadi Lamb', N'Mzwadi vom Lamm', N'ცხვრის მწვადი', N'Grilled skewers, 250 g.', N'Gegrillte Spieße, 250 g.', N'შემწვარი მწვადი, 250 გ.', 21.50, 1, 11),
(@mains, N'Mtsvadi Salmon', N'Mzwadi vom Lachs', N'ორაგულის მწვადი', N'Grilled skewers, 200 g.', N'Gegrillte Spieße, 200 g.', N'შემწვარი მწვადი, 200 გ.', 21.50, 1, 12),
(@mains, N'Mtsvadi Platter', N'Mzwadi-Assorti', N'მწვადის ასორტი', N'Grilled skewers for 2 of chicken, pork, lamb and veal.', N'Grillspieße für 2 Personen vom Hähnchen, Schwein, Lamm und Kalb.', N'მწვადის ასორტი 2 პერსონაზე — ქათამი, ღორი, ცხვარი და ხბო.', 45.00, 1, 13);

-- Sides & Sauces ------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@sides, N'Fried Potatoes', N'Bratkartoffeln', N'შემწვარი კარტოფილი', NULL, NULL, NULL, 4.50, 1, 1),
(@sides, N'French Fries', N'Pommes frites', N'კარტოფილი ფრი', NULL, NULL, NULL, 5.00, 1, 2),
(@sides, N'Grilled Vegetables', N'Gegrilltes Gemüse', N'შემწვარი ბოსტნეული', NULL, NULL, NULL, 5.50, 1, 3),
(@sides, N'Rice', N'Reis', N'ბრინჯი', NULL, NULL, NULL, 4.00, 1, 4),
(@sides, N'Satsebeli', N'Satsebeli', N'საწებელა', N'Traditional Georgian tomato sauce.', N'Traditionelle georgische Tomatensauce.', N'ტრადიციული ქართული პომიდვრის სოუსი.', 3.50, 1, 5),
(@sides, N'Tkemali', N'Tkemali', N'ტყემალი', N'Tangy Georgian plum sauce.', N'Pikante georgische Pflaumensauce.', N'ცხარე ქართული ქლიავის სოუსი.', 4.50, 1, 6),
(@sides, N'Baje', N'Baje', N'ბაჟე', N'Creamy Georgian walnut sauce.', N'Cremige georgische Walnusssauce.', N'ნაზი ქართული ნიგვზის სოუსი.', 5.90, 1, 7);

-- Desserts ------------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@desserts, N'Pelamushi', N'Pelamushi', N'ფელამუში', N'Georgian dessert of grape juice, gently cooked and lightly sweet.', N'Georgisches Dessert aus Weintraubensaft, fein gekocht und leicht süßlich im Geschmack.', N'ქართული დესერტი ყურძნის წვენისგან, ნაზად მოხარშული და მსუბუქად ტკბილი.', 5.50, 1, 1),
(@desserts, N'Napoleoni', N'Napoleoni', N'ნაპოლეონი', N'House-made layer cake with airy cream.', N'Hausgemachter Schichtkuchen mit luftiger Creme.', N'სახლის ფენებიანი ნამცხვარი ჰაეროვანი კრემით.', 6.50, 1, 2),
(@desserts, N'Gozinaki', N'Gozinaki', N'გოზინაყი', N'Crisp Georgian sweet of caramelized honey and walnuts.', N'Knusprige georgische Süßigkeit aus karamellisiertem Honig und Walnüssen.', N'ხრაშუნა ქართული ტკბილეული კარამელიზებული თაფლითა და ნიგვზით.', 8.00, 1, 3);

-- Drinks --------------------------------------------------------------------
INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa, Price, IsAvailable, DisplayOrder) VALUES
(@drinks, N'Rkatsiteli (Bottle)', N'Rkatsiteli (Flasche)', N'რქაწითელი (ბოთლი)', N'White wine, dry. 0.2 l glass €7.20.', N'Weißwein, trocken. 0,2-l-Glas 7,20 €.', N'თეთრი ღვინო, მშრალი. 0,2 ლ ჭიქა 7,20 €.', 24.00, 1, 1),
(@drinks, N'Tarkhuna', N'Tarkhuna', N'ტარხუნა', N'Georgian tarragon lemonade.', N'Georgische Estragon-Limonade.', N'ქართული ტარხუნის ლიმონათი.', 4.00, 1, 2),
(@drinks, N'Chacha', N'Chacha', N'ჭაჭა', N'Georgian grape brandy.', N'Georgischer Traubenbrand.', N'ქართული ყურძნის არაყი.', 5.50, 1, 3),
(@drinks, N'Georgian Tea', N'Georgischer Tee', N'ქართული ჩაი', N'Black tea with herbs.', N'Schwarzer Tee mit Kräutern.', N'შავი ჩაი მწვანილებით.', 3.50, 1, 4);

COMMIT TRANSACTION;
GO

# Easy setup (one website, one Azure app)

Use **only `flaudaa`** — the API serves the restaurant website at the same URL.  
You can ignore **`flaudaa-web`** for now.

## 1. Azure Portal → **flaudaa** → **Environment variables**

Add **two** settings (then **Save** and **Restart**) — use the values from the assistant chat or `Fulda.API/Fulda.API/appsettings.Production.local.json` on your PC (gitignored).

Optional later: `AzureStorage__ConnectionString` (for admin photo uploads).

## 2. SQL database user (one-time)

If you use SQL login (easiest):

1. **flaudaa-server** → **SQL databases** → **flaudaa-database** → **Query editor** (or SSMS).
2. Run (change password):

```sql
CREATE USER [flaudaa_app] WITH PASSWORD = 'PickAStrongPassword123!';
ALTER ROLE db_datareader ADD MEMBER [flaudaa_app];
ALTER ROLE db_datawriter ADD MEMBER [flaudaa_app];
```

3. Connection string for step 1:

```
Server=tcp:flaudaa-server.database.windows.net,1433;Initial Catalog=flaudaa-database;User ID=flaudaa_app;Password=PickAStrongPassword123!;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

4. **flaudaa-server** → **Networking** → allow **Azure services** (or your IP for testing).

Migrations (if not done): run `001_InitialSchema.sql` and `002_SeedData.sql` on the database.

## 3. Deploy

Push to **`main`** on GitHub. Workflow **Build and deploy ASP.Net Core app to Azure Web App - flaudaa** runs automatically.

## 4. Open the site

https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net/

- Website: same URL  
- API / Swagger: `/swagger`  
- Admin: `/admin` — login **admin** / **Admin123!** (created on first successful DB connection)

## Local development

- API: run **Fulda.API** in Visual Studio  
- Frontend: `cd Fulda.API/Fulda.API/wwwroot` → `npm run dev`  
- Stop the API before rebuilding if files are locked

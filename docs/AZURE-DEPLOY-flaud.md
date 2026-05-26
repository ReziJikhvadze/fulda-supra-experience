# Azure deployment — flaud resource group

Your API App Service: **flaudaa**  
URL: `https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net`

## Fix: MSB1003 (no project in directory)

GitHub Actions was running `dotnet build` at the **repo root**. The .NET solution is under **`Fulda.API/`**.

Updated workflow: `.github/workflows/main_flaudaa.yml`  
It builds: `Fulda.API/Fulda.API/Fulda.API.csproj`

**Commit and push to `main`** — the API deploy should succeed.

---

## API App Service settings (Configuration)

**If the API log shows `ConnectionString property has not been initialized`**, `flaudaa` has no SQL connection string. Add it below and **Save** → **Restart** the app.

Portal: **flaudaa** → **Settings** → **Environment variables** (or **Configuration** → **Application settings**).

| Name | Value |
|------|--------|
| `ConnectionStrings__DefaultConnection` | Your SQL connection string (see below) — **required** |
| `Jwt__Secret` | Long random string (32+ chars) — **required** |
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `AzureStorage__ConnectionString` | Storage account connection string (for admin image uploads) |
| `AzureStorage__ContainerName` | `fulda-image` |
| `Cors__AllowedOrigins__0` | `https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net` |

You can set the database string under **Connection strings** instead: name **`DefaultConnection`**, type **SQLAzure**, same value — .NET maps both.

### SQL connection (Active Directory Default)

```
Server=tcp:flaudaa-server.database.windows.net,1433;Initial Catalog=flaudaa-database;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;Authentication=Active Directory Default;
```

Required:

1. **flaudaa** App Service → **Identity** → turn on **System assigned** managed identity.
2. **flaudaa-server** (SQL) → **Microsoft Entra ID** → set admin, then add the App Service identity as a user on **flaudaa-database** (e.g. `db_datareader`, `db_datawriter`, `db_ddladmin` for migrations).
3. You use a **private endpoint** for SQL. The App Service must reach the database:
   - **Option A:** VNet integrate the App Service into `vnet-zyrtoqyq` and use private DNS, or  
   - **Option B:** Temporarily allow Azure services / public access on SQL firewall for testing.

Run migrations once (SSMS or Azure Data Studio connected with Entra ID):

- `Fulda.API/database/migrations/001_InitialSchema.sql`
- `Fulda.API/database/migrations/002_SeedData.sql`

Test API: `https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net/swagger`

---

## Web app (frontend) — flaudaa-web

URL: `https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net`

The default Azure “waiting for your content” page means **no successful deploy** yet (empty `wwwroot`) or the app is not serving static files.

1. **GitHub secret for web deploy** (required):
   - **flaudaa-web** → **Overview** → **Download publish profile**
   - GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: paste the entire `.PublishSettings` XML file

   The web workflow uses this profile. OIDC secrets from **flaudaa** (API) cannot deploy to **flaudaa-web** — that causes `Resource flaudaa-web doesn't exist`.

2. Push to `main` or run workflow **Build and deploy frontend to Azure Web App - flaudaa-web** (Actions tab → Run workflow).

3. Confirm the deploy job log shows `publish-profile: ***` and **succeeds**. If you see “No credentials found”, add the secret above.

4. The build ships `index.html` + assets + a small `package.json` (`serve`) so App Service runs `npm start` after deploy.

5. **flaudaa-web** → **Configuration** → **Application settings**:
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true` (if `npm install` does not run on deploy)
   - `WEBSITES_PORT` = `8080`

6. Fallback startup command (if the site still shows the placeholder after a green deploy):
   ```bash
   npm start
   ```

Add API CORS origin for the web URL.

---

## What you have in Azure (flaud RG)

| Resource | Role |
|----------|------|
| flaudaa | API App Service |
| flaudaa-server / flaudaa-database | SQL |
| ASP-flaud-8c0f | App Service plan (share with web app) |
| Storage | Still needed for admin image uploads |
| Private endpoint + VNet | SQL private access — configure networking for App Service |

---

## Visual Studio publish (without GitHub)

Right-click **Fulda.API** → **Publish** → **flaudaa** → publish.  
For auto-deploy on commit, keep using GitHub Actions (Deployment Center), not only VS Publish.

---

## Optional: Blob storage

Create a Storage account in **flaud**, container `fulda-image`, then:

`AzureStorage__ConnectionString` = storage connection string on **flaudaa** API app.

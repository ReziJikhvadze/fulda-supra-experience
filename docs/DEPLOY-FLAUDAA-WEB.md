# Deploy frontend to flaudaa-web

| App | URL | Role |
|-----|-----|------|
| **flaudaa** | https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net | API |
| **flaudaa-web** | https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net | Website |

---

## A) Manual deploy (fastest if GitHub Actions fails)

1. In PowerShell from repo root:

```powershell
.\scripts\publish-web-to-flaudaa-web.ps1
```

2. Azure Portal → **flaudaa-web** → **Deployment Center** → **ZIP Deploy** (or **Advanced Tools** → Kudu → drag zip).

   Upload: `publish\flaudaa-web.zip`

3. **flaudaa-web** → **Configuration** → **Application settings**:

| Name | Value |
|------|--------|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `WEBSITES_PORT` | `8080` |

4. **Startup command** (General settings):

```bash
npm start
```

5. **Save** → **Restart** **flaudaa-web**.

Open: https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net/

---

## B) GitHub Actions

1. **flaudaa-web** → **Overview** → **Download publish profile**
2. GitHub repo → **Settings** → **Secrets** → `AZURE_WEBAPP_PUBLISH_PROFILE` = full XML
3. Push to `main` or run workflow **deploy-flaudaa-web**

---

## API must allow the web origin

On **flaudaa** (already in `appsettings.Production.json`):

`Cors__AllowedOrigins__0` = `https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net`

Restart **flaudaa** if you add it in Portal.

---

## Check

- Website: flaudaa-web URL → Am Stockhaus home page  
- API: flaudaa URL → `/api/health` → healthy  
- Reservation form → calls API on flaudaa

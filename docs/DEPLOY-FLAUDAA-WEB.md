# Deploy frontend to flaudaa-web

| App | URL | Role |
|-----|-----|------|
| **flaudaa** | https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net | API (+ optional combined site) |
| **flaudaa-web** | https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net | Website only |

---

## Fix rsync / exit code 23 on deploy

Azure was running **Oryx build** on zip deploy while the package is already built static files → rsync errors on `index.html` and `assets/`.

**Required on flaudaa-web** → **Configuration** → **Application settings**:

| Name | Value |
|------|--------|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | **`false`** |
| `WEBSITES_PORT` | `8080` |

**Startup command** (only if the site is blank after a successful deploy):

Azure moved this in newer portals. Try in order:

1. **flaudaa-web** → **Settings** → **Environment variables** → top section **Platform settings** → **Startup command** → `npm start`
2. Or **Settings** → **Configuration (preview)** → **General settings** tab → **Startup command**
3. Or **Settings** → **Configuration** (classic) → **General settings** → **Startup command**

**No field?** You can skip it — see below. Or set via CLI:

```powershell
az webapp config set --resource-group flaud --name flaudaa-web --startup-file "npm start"
```

Save → Restart.

The repo ships `.deployment` with `SCM_DO_BUILD_DURING_DEPLOYMENT=false` in each deploy zip; the app setting above must match.

---

## A) GitHub Actions (recommended)

1. **flaudaa-web** → **Overview** → **Download publish profile**
2. GitHub → repo **Settings** → **Secrets** → `AZURE_WEBAPP_PUBLISH_PROFILE` = full XML
3. Push to **`main`** or run workflow **deploy-flaudaa-web** manually (Actions → deploy-flaudaa-web → **Run workflow**).

**Pipeline did not start after push?**
- Confirm branch is **`main`** (not `master` or a feature branch).
- Repo **Settings** → **Actions** → **General** → allow actions.
- Path filters were removed — any push to `main` runs this workflow.
- Or trigger manually: **Actions** → **deploy-flaudaa-web** → **Run workflow**.

Workflow builds SPA, runs `npm install` for `serve` in CI, deploys **without** Oryx rebuild.

---

## B) Manual zip deploy

```powershell
.\scripts\publish-web-to-flaudaa-web.ps1
```

Upload `publish\flaudaa-web.zip` → **flaudaa-web** → **Deployment Center** → ZIP Deploy.

---

## API CORS

On **flaudaa**:

`Cors__AllowedOrigins__0` = `https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net`

Restart **flaudaa** after changing.

---

## Check

- https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net/ → homepage
- https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net/api/health → healthy
- Admin login / image upload → API on **flaudaa**

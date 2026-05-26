# Deploy without GitHub Actions

Use this if **Run workflow** always fails or nothing runs after push.

## Option A — Visual Studio Publish (easiest)

1. Open `Fulda.API/Fulda.API.slnx` in Visual Studio.
2. Right-click project **Fulda.API** → **Publish**.
3. Target: **Azure** → **Azure App Service (Windows)** or **Linux** → select **flaudaa**.
4. Sign in to your Azure account if asked.
5. **Publish**.

Before publishing, build the website once:

```powershell
cd Fulda.API\Fulda.API\wwwroot
npm ci
npm run build:azure
```

Then copy the build into the API (from repo root):

```powershell
Remove-Item -Recurse -Force Fulda.API\Fulda.API\spa -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path Fulda.API\Fulda.API\spa | Out-Null
Copy-Item -Recurse Fulda.API\Fulda.API\wwwroot\dist\azure\* Fulda.API\Fulda.API\spa\
```

Publish again so the site is included.

---

## Option B — Azure Portal Deployment Center

1. Portal → **flaudaa** → **Deployment Center**.
2. Source: **GitHub** → authorize → repo **fulda-supra-experience** → branch **main**.
3. Azure builds and deploys (uses Azure’s builder, not GitHub Actions UI).

If it already shows GitHub connected, click **Sync** or **Save** to redeploy.

---

## Option C — Fix GitHub Actions later

Billing is **not** under repo Settings for free personal accounts.

Check account level: https://github.com/settings/billing

Also verify on the repo:

1. https://github.com/ReziJikhvadze/fulda-supra-experience/settings/actions  
   - Must be **Allow all actions** (not **Disable actions**).

2. Delete broken workflow on GitHub (browser):  
   `.github/workflows/main_flaudaa-web.yml` if it still exists.

3. Confirm `hello.yml` exists on **main**:  
   https://github.com/ReziJikhvadze/fulda-supra-experience/blob/main/.github/workflows/hello.yml  
   If 404, push from Visual Studio first.

4. Account email must be **verified**: https://github.com/settings/emails

---

## After deploy — Azure settings on flaudaa

| Setting | Value |
|---------|--------|
| `ConnectionStrings__DefaultConnection` | Your SQL connection string |
| `Jwt__Secret` | Your JWT secret |

Restart **flaudaa**, then open:

https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net/api/health

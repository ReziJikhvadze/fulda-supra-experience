# Fix "Failed to queue workflow run"

This error is almost always caused by a **broken workflow file still on GitHub**, not Azure.

## Step 1 — Delete the broken workflow ON GITHUB (do this in the browser)

1. Open:  
   https://github.com/ReziJikhvadze/fulda-supra-experience/tree/main/.github/workflows

2. If you see **`main_flaudaa-web.yml`** (name contains "optional" or em-dash), open it.

3. Click the **trash** icon → **Commit changes** directly on `main`.

That file breaks manual "Run workflow" for the whole repo.

## Step 2 — Push the new workflows from Visual Studio

Commit and push:

- `.github/workflows/deploy.yml` (main deploy)
- `.github/workflows/hello.yml` (tiny test)
- deletion of `main_flaudaa.yml`

## Step 3 — Test queue

1. **Actions** → **hello-test** → **Run workflow** → `main` → **Run workflow**

If **hello-test** runs, Actions is fixed.

2. Then use **deploy-flaudaa** (or push to `main` to start it automatically).

## Step 4 — Deploy without "Run workflow" (always works)

On GitHub in the browser:

1. Open **README.md** → **Edit** (pencil)
2. Add a space at the end → **Commit changes** to `main`

That triggers **deploy-flaudaa** via `push` even if manual run still fails.

## If hello-test also fails to queue

- **Settings → Actions → General** → Save again with "Allow all actions"
- **Settings → Billing** → ensure Actions minutes are available (private repos)
- Try another browser or incognito
- Wait 15 minutes (GitHub incident) and retry

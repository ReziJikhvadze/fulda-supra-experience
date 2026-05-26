# Pipeline not starting? Do this in Visual Studio

GitHub Actions **only runs after code is on GitHub**. Saving files on your PC is not enough.

## Step 1 — Commit (Git Changes)

1. Visual Studio → **View** → **Git Changes** (or status bar branch icon).
2. You should see changed files (`.github/workflows/`, `Program.cs`, etc.).
3. Enter message: `Deploy fixes and health check`
4. Click **Commit All**.

If Git Changes shows **nothing**, your edits may not be saved — save all files (Ctrl+Shift+S) and check again.

## Step 2 — Push

1. After commit, click **Push** (or **Sync** then Push).
2. Sign in to GitHub if prompted.
3. Repo: `https://github.com/ReziJikhvadze/fulda-supra-experience`
4. Branch must be **`main`**.

## Step 3 — Watch the run

1. Open in browser:  
   `https://github.com/ReziJikhvadze/fulda-supra-experience/actions`
2. Workflow: **Deploy flaudaa**
3. A yellow dot = running; green = success.

## Step 4 — Manual run (no new code)

1. Same **Actions** page.
2. Click the workflow name on the left.
3. **Run workflow** → Branch **main** → **Run workflow**.

If **Run workflow** is missing, the workflow file is not on `main` yet — do Step 1–2 first.

## Wrong place?

| You opened | What you need |
|------------|----------------|
| Azure Portal → Deployment Center | Can show status, but build is on **GitHub Actions** |
| Azure DevOps / `azure-pipelines.yml` | Not used unless you set up Azure DevOps separately |
| GitHub → Actions | **Correct** |

## "Failed to queue workflow run"

1. **Push the workflow file first** — manual run only works if `.github/workflows/main_flaudaa.yml` is on `main` on GitHub (commit + push in Visual Studio).
2. **Settings** → **Actions** → **General** → **Allow all actions and reusable workflows** → Save.
3. Use workflow **Deploy flaudaa** (not old Azure-generated names).
4. Try another browser or wait 5 minutes (GitHub glitch).
5. **Alternative:** push any commit to `main` — that starts the deploy without **Run workflow**.

## Still nothing?

- Confirm you can push to `ReziJikhvadze/fulda-supra-experience` on branch `main`.
- Private repo: check **Settings** → **Billing** — Actions need available minutes.

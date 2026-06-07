# Fix: site still shows old logo (logo-....svg)

Zip deploy **adds** files but often **does not remove** old `index.html` and old JS.  
Azure keeps serving the old bundle that references `logo-BMtTO6Rf.svg`.

## Fix (one time)

### Step 1 — Wipe old files on Azure

1. Portal → **flaudaa-web** → **Advanced Tools** → **Go** (Kudu)
2. Top menu → **Debug console** → **CMD**
3. Go to: `cd site\wwwroot`
4. Delete everything:

```cmd
del /s /q *
for /d %i in (*) do rmdir /s /q "%i"
```

(Or in Kudu **file manager**: open `site/wwwroot`, select all, delete.)

### Step 2 — Rebuild zip on your PC

Double-click:

`scripts\publish-web-to-flaudaa-web.cmd`

Or run the build commands from the main deploy doc.

Zip path: `publish\flaudaa-web.zip`

### Step 3 — Upload zip again

Portal → **flaudaa-web** → **Deployment Center** → **ZIP Deploy** → upload `flaudaa-web.zip`

Wait until success → **Restart** flaudaa-web.

### Step 4 — Verify

Open (incognito):  
https://flaudaa-web-c3c5ash8agbff0dk.canadacentral-01.azurewebsites.net/

Press **F12** → **Network** → refresh.

You should see:

- `index-CLMtHzA-.js` (or newer hash) — **not** `index-ciie_EXV.js`
- `logo-DcNiQAxu.png` — **not** `logo-BMtTO6Rf.svg`
- `favicon.png` — **not** `favicon.svg`

## If you use the API URL (flaudaa, no -web)

That is a **different** app. Zip to flaudaa-web does not update it.  
Use **flaudaa-web** URL, or rebuild `spa/` and publish **flaudaa** from Visual Studio.

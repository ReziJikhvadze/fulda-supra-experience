# Upload original site images to Azure Blob

The repo still has JPEGs under `Fulda.API/Fulda.API/wwwroot/src/assets/` (hero, gallery, dishes).  
After deploy, **Signature Plates** and admin menu items need `ImageUrl` in SQL pointing at blob URLs.

Use the one-time seed command (safe to run again — it overwrites the same blob paths).

## Prerequisites

1. **Azure Storage** account (e.g. `fuldaimages`) with container **`fulda-image`** (blob public read, or CDN in front).
2. **SQL** reachable with the same connection string the API uses.
3. Connection string available locally (do **not** commit it).

## Option A — Run from your PC (recommended)

### 1. Set secrets for this run only (PowerShell)

**Option A — account name + key (easiest in PowerShell; avoids `+` / `/` issues):**

```powershell
$env:AzureStorage__AccountName = "fuldaimages"
$env:AzureStorage__AccountKey = '<paste key1 key only from Access keys — use single quotes>'
$env:AzureStorage__ContainerName = "fulda-image"
$env:ConnectionStrings__DefaultConnection = "<your Azure SQL connection string>"
```

**Option B — full connection string (must use single quotes):**

```powershell
$env:AzureStorage__ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=fuldaimages;AccountKey=...;EndpointSuffix=core.windows.net'
$env:AzureStorage__ContainerName = "fulda-image"
```

If you see `No valid combination of account information found`, you likely set only the key, used double quotes, or truncated the string.

Or use **User Secrets** in `Fulda.API/Fulda.API`:

```powershell
cd Fulda.API\Fulda.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<sql>"
dotnet user-secrets set "AzureStorage:ConnectionString" "<storage>"
dotnet user-secrets set "AzureStorage:ContainerName" "fulda-image"
```

### 2. Run the seeder

```powershell
cd Fulda.API\Fulda.API
dotnet run -- --seed-blob-images
```

You should see lines like:

```text
Uploaded dish-khachapuri.jpg -> https://fuldaimages.blob.core.windows.net/fulda-image/seed/menu/dish-khachapuri.jpg
Done. Uploaded 18 file(s); updated N menu row(s).
```

### 3. Verify

- Azure Portal → Storage → `fulda-image` → folder `seed/menu` and `seed/site`
- SQL: `SELECT Name, ImageUrl FROM MenuItems WHERE ImageUrl IS NOT NULL`
- Homepage Signature Plates and Admin → Menu thumbnails

### 4. Deploy API as usual

Azure App Service **`flaudaa`** must have the same app settings:

| Setting | Value |
|--------|--------|
| `AzureStorage__ConnectionString` | storage connection string |
| `AzureStorage__ContainerName` | `fulda-image` |
| `ConnectionStrings__DefaultConnection` | Azure SQL |

You do **not** need to run `--seed-blob-images` on Azure after a successful local run — URLs are already in the database and blobs are in storage.

## Option B — Azure Portal (manual)

1. Storage account → Containers → `fulda-image` → Upload
2. Upload files from `wwwroot/src/assets/` under paths like `seed/menu/dish-khachapuri.jpg`
3. Copy each blob URL
4. Run SQL updates, e.g.:

```sql
UPDATE MenuItems SET ImageUrl = 'https://fuldaimages.blob.core.windows.net/fulda-image/seed/menu/dish-khachapuri.jpg'
WHERE Name = 'Adjaruli Khachapuri';
```

Repeat for each dish (see `Fulda.API/Fulda.API/Seed/image-asset-map.json` for names).

## What gets updated

| Blob folder | Used for |
|-------------|----------|
| `seed/menu/*` | Menu items (Signature Plates + matching names in other categories) |
| `seed/site/*` | Uploaded for backup; hero/gallery/story still use bundled assets in the SPA unless you wire them to CMS later |

To change mappings, edit `Seed/image-asset-map.json` and run `--seed-blob-images` again.

## Hero / gallery still static?

Yes — those sections still import from `@/assets` in the React build. They work on deploy because Vite bundles them.  
Only **database-driven** images (menu, wines, staff `ImageUrl`) need blob + SQL. The seed command fixes menu/signature dishes; site images are uploaded to blob for your archive and future CMS use.

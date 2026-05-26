# Fulda Supra Experience — Am Stockhaus

Full-stack restaurant platform: Loveable (TanStack Start) frontend + .NET 8 Clean Architecture API.

## Solution structure

```
Fulda.API/
├── Fulda.Domain/           # Entities, enums
├── Fulda.Application/      # DTOs, validators, services, repository interfaces
├── Fulda.Infrastructure/   # Dapper repos, JWT, Azure Blob, Serilog
├── Fulda.API/              # Web API, controllers, middleware
├── database/migrations/    # SQL Server scripts
└── Fulda.API/wwwroot/      # Loveable frontend (React)
```

## Prerequisites

- .NET 8 SDK
- SQL Server or LocalDB
- Node.js 20+ (for frontend dev)
- Azure subscription (for production deployment)

## Database setup

1. Create a database (e.g. `FuldaDb`).
2. Run migration scripts in order:

```powershell
sqlcmd -S "(localdb)\mssqllocaldb" -d FuldaDb -i database\migrations\001_InitialSchema.sql
sqlcmd -S "(localdb)\mssqllocaldb" -d FuldaDb -i database\migrations\002_SeedData.sql
```

Or use SQL Server Management Studio to execute the scripts.

## Configuration

Edit `Fulda.API/appsettings.json` or use environment variables:

| Setting | Environment variable | Description |
|---------|---------------------|-------------|
| `ConnectionStrings:DefaultConnection` | `ConnectionStrings__DefaultConnection` | SQL Server connection |
| `Jwt:Secret` | `Jwt__Secret` | JWT signing key (min 32 chars) |
| `AzureStorage:ConnectionString` | `AzureStorage__ConnectionString` | Azure Blob Storage |
| `AzureStorage:ContainerName` | `AzureStorage__ContainerName` | Blob container name |

### Default admin user

On first startup the API seeds an admin account if none exists:

- **Username:** `admin`
- **Password:** `Admin123!`

Change this immediately in production.

## Run locally

### Backend

```powershell
cd Fulda.API
dotnet run --project Fulda.API/Fulda.API.csproj
```

API: `http://localhost:5116`  
Swagger: `http://localhost:5116/swagger`

### Frontend

```powershell
cd Fulda.API/Fulda.API/wwwroot
npm install
npm run dev
```

Frontend dev server proxies `/api` to the .NET API.

## API endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/menu` | Public menu |
| GET | `/api/wines` | Public wines |
| GET | `/api/staff` | Active staff |

### Admin (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/reservations` | List/filter reservations |
| PUT | `/api/reservations/{id}/status` | Confirm/cancel |
| DELETE | `/api/reservations/{id}` | Delete reservation |
| CRUD | `/api/menu/*` | Menu management |
| CRUD | `/api/wines/*` | Wine management |
| CRUD | `/api/staff/*` | Staff management |
| POST | `/api/images/upload` | Upload image (JPG/PNG/WEBP) |
| DELETE | `/api/images?url=` | Delete image |

## Admin panel

Navigate to `/admin/login` on the frontend.

Sections: Reservations, Menu, Wines, Staff.

## Azure deployment

### Resources

1. **Azure App Service** — hosts the .NET API
2. **Azure SQL Database** — production database
3. **Azure Blob Storage** — image uploads

### App Service configuration

Set application settings in Azure Portal:

```
ConnectionStrings__DefaultConnection = <Azure SQL connection string>
Jwt__Secret = <strong random secret>
AzureStorage__ConnectionString = <storage account connection string>
AzureStorage__ContainerName = fulda-images
ASPNETCORE_ENVIRONMENT = Production
```

### CI/CD

Use `azure-pipelines.yml` at the repo root. Configure pipeline variables:

- `AzureServiceConnection`
- `AzureAppServiceName`
- `DefaultConnection`
- `JwtSecret`
- `AzureStorageConnectionString`

## Security features

- JWT authentication with role-based authorization
- BCrypt password hashing
- FluentValidation on all inputs
- Dapper parameterized queries (SQL injection protection)
- Global exception handling middleware
- Rate limiting (100 requests/minute per IP)
- File upload validation (type + size)

## Frontend notes

The public Loveable UI is unchanged in design. Integration points:

- `Reservation.tsx` → `POST /api/reservations`
- Admin routes at `/admin/*` use existing brand colors and shadcn components

Menu and wine sections continue to use i18n static content by default; admin-managed data is available via API for future dynamic loading.

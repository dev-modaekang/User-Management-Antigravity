# User Management (ASP.NET Core + SQLite + React)

> **Summary**  
> A simple user management web app.  
> - **Backend:** C# / ASP.NET Core Web API  
> - **Database:** SQLite  
> - **Frontend:** React (Vite + TypeScript)

---

## Project Structure

> **Folders & files**
> - `UserManagement.API/` — .NET Web API backend  
> - `UserManagement.Client/` — React frontend  
> - `UserManagement.sln` — Visual Studio solution file  

---

## Prerequisites

> **You need**
> - **.NET SDK** (the version used by this project)  
> - **Node.js + npm**  
> - (Optional) Visual Studio / VS Code  

---

## Getting Started

### 1) Run the Backend (API)

> **Command (from repo root)**

```bash
dotnet restore
dotnet run --project UserManagement.API
```

> **Note**  
> The API URL will be printed in the console (e.g. `https://localhost:xxxx` or `http://localhost:xxxx`).

> **Tip**  
> If Swagger is enabled, open:  
> - `https://localhost:xxxx/swagger`

---

### 2) Run the Frontend (Client)

> **Commands**

```bash
cd UserManagement.Client
npm install
npm run dev
```


> **Note**  
> The Vite dev server URL will be printed in the console (usually `http://localhost:5173`).

---

## SQLite Database

> **Goal**  
> Provide a ready-to-run experience with a **sample DB** while keeping each developer’s **local runtime DB** out of Git.

### Recommended Approach (Sample DB tracked, Local DB ignored)

> **Tracked in Git**
> - Sample DB: `UserManagement.sample.db` (example name)

> **Not tracked (local only)**
> - Runtime DB: `UserManagement.db`

> **Why this approach?**
> - A sample DB makes first run easy  
> - Local DB changes don’t spam commits  
> - Avoids merge conflicts in binary DB files  

---

### First-time Setup (Copy sample DB)

> **macOS / Linux**

```bash
cp UserManagement.sample.db UserManagement.db
```



> **Windows (PowerShell)**

```powershell
Copy-Item UserManagement.sample.db UserManagement.db
```

> **Note**  
> If your DB file lives inside a folder (e.g. `UserManagement.API/`), update the paths accordingly:

> - **macOS/Linux:** `cp UserManagement.API/UserManagement.sample.db UserManagement.API/UserManagement.db`  
> - **PowerShell:** `Copy-Item UserManagement.API\UserManagement.sample.db UserManagement.API\UserManagement.db`  

---

### Optional: EF Core Migrations (If you use migrations)

> **Info**  
> If the project uses EF Core migrations, you can recreate the database from migrations instead of copying a sample DB.

```bash
dotnet ef database update --project UserManagement.API
```

## Development Notes

> **Do not commit build outputs**
> - .NET: `bin/`, `obj/`, `.vs/`
> - React: `node_modules/`, `dist/`

> **Do not commit machine-specific or secret config**
> - Example: `appsettings.Development.json` (if it contains local-only values or secrets)

---

## Common Commands

> **Backend**

```bash
dotnet run --project UserManagement.API
```


> **Frontend**

```bash
cd UserManagement.Client
npm install
npm run dev
```

## Troubleshooting

> **If the frontend cannot reach the backend**
> - Confirm the API URL printed in the backend console  
> - Check CORS settings in the API  
> - If using a Vite proxy, confirm `vite.config.ts` points to the correct backend URL  

> **If ports are already in use**
> - Stop the process using the port or change the port in your launch/settings  

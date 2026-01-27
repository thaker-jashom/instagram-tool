# Deploy Prisma Schema to Supabase

## Step-by-Step Guide

### Prerequisites
- Supabase project created
- Supabase database URL copied
- Local database has data you want to migrate

---

## Step 1: Get Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find **Connection string** section
4. Copy the **URI** connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
5. Replace `[YOUR-PASSWORD]` with your database password

---

## Step 2: Update Environment Variables

### Option A: Use Separate Variables (Recommended for Migration)

Add to your `.env` file:

```env
# Local Database (for exporting data)
LOCAL_DATABASE_URL=postgresql://user:password@localhost:5432/your_local_db

# Supabase Database (for importing data)
SUPABASE_DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
```

### Option B: Switch to Supabase (After Migration)

Replace `DATABASE_URL` in `.env`:

```env
# After migration, use Supabase as main database
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
```

---

## Step 3: Deploy Schema to Supabase

### Method 1: Using Prisma Migrate (Recommended)

```bash
# Set Supabase URL temporarily
export DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# Or on Windows PowerShell:
$env:DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# Push schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Method 2: Using Prisma Migrate Deploy

```bash
# Create a new migration
npx prisma migrate dev --name migrate_to_supabase

# Apply migration to Supabase
npx prisma migrate deploy
```

---

## Step 4: Migrate Data from Local to Supabase

### Run the Migration Script

```bash
# Make sure both LOCAL_DATABASE_URL and SUPABASE_DATABASE_URL are set in .env
npm run migrate:to-supabase

# Or directly with ts-node:
npx ts-node scripts/migrate-to-supabase.ts
```

---

## Step 5: Verify Migration

### Check Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Verify tables exist:
   - `Influencer`
   - `User`
   - `SavedSearch`
   - `SavedInfluencer`
3. Check row counts match your local database

### Test Connection

```bash
# Test Supabase connection
npx prisma studio
# This will open Prisma Studio - make sure DATABASE_URL points to Supabase
```

---

## Step 6: Update Render Environment Variables

1. Go to Render Dashboard → Your Service → Environment
2. Update `DATABASE_URL` to your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
   ```
3. Save and redeploy

---

## Troubleshooting

### Connection Issues

- **SSL Required**: Supabase requires SSL. Add `?sslmode=require` to connection string:
  ```
  postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
  ```

- **Connection Pooling**: For production, use Supabase connection pooler:
  ```
  postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?sslmode=require
  ```
  (Note: Port 6543 for pooler, 5432 for direct)

### Schema Issues

- **UUID Extension**: Supabase should have `uuid-ossp` extension. If not:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

- **Array Types**: Prisma arrays work with Supabase PostgreSQL arrays

---

## Quick Reference Commands

```bash
# 1. Deploy schema
npx prisma db push

# 2. Generate client
npx prisma generate

# 3. Migrate data
npx ts-node scripts/migrate-to-supabase.ts

# 4. Verify with Prisma Studio
npx prisma studio
```

---

## After Migration

1. ✅ Update `DATABASE_URL` in Render to Supabase URL
2. ✅ Test all API endpoints
3. ✅ Verify data integrity
4. ✅ Update frontend if needed (should work automatically)






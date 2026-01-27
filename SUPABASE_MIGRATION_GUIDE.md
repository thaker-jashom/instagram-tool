# Complete Supabase Migration Guide

## Quick Start Checklist

- [ ] Get Supabase connection string
- [ ] Add `SUPABASE_DATABASE_URL` to `.env`
- [ ] Deploy schema: `npx prisma db push`
- [ ] Migrate data: `npm run migrate:to-supabase`
- [ ] Update Render `DATABASE_URL` to Supabase
- [ ] Test and verify

---

## Detailed Steps

### 1. Get Supabase Database URL

1. Login to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Under **Connection string**, copy the **URI**
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**With SSL (Recommended):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

---

### 2. Update Your .env File

Add these to your `.env` file:

```env
# Your local database (for exporting data)
LOCAL_DATABASE_URL=postgresql://user:password@localhost:5432/your_local_db

# Supabase database (for importing data and production)
SUPABASE_DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres?sslmode=require

# After migration, you can replace DATABASE_URL with Supabase URL
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

---

### 3. Deploy Schema to Supabase

```bash
# Set Supabase as target
$env:DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Push schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

**Expected Output:**
```
✔ Your database is now in sync with your Prisma schema.
```

---

### 4. Migrate Data from Local to Supabase

```bash
# Make sure both LOCAL_DATABASE_URL and SUPABASE_DATABASE_URL are in .env
npm run migrate:to-supabase
```

**What it does:**
- Connects to local database
- Exports all data (Users, Influencers, SavedSearches, SavedInfluencers)
- Connects to Supabase
- Imports all data with upsert (handles duplicates)

---

### 5. Verify Migration

#### Option A: Supabase Dashboard
1. Go to **Table Editor**
2. Check each table has data
3. Verify row counts match

#### Option B: Prisma Studio
```bash
# Make sure DATABASE_URL points to Supabase
npx prisma studio
```
Opens browser at `http://localhost:5555` - browse your data

---

### 6. Update Render Environment

1. Go to Render Dashboard → Your Service
2. Navigate to **Environment** tab
3. Update `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
   ```
4. **Save Changes**
5. **Redeploy** your service

---

## Troubleshooting

### SSL Connection Error

**Error:** `SSL connection required`

**Solution:** Add `?sslmode=require` to connection string:
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### UUID Extension Missing

**Error:** `extension "uuid-ossp" does not exist`

**Solution:** Run in Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Connection Timeout

**Error:** `Connection timeout`

**Solution:** 
- Check Supabase project is active
- Verify password is correct
- Try connection pooler port (6543 instead of 5432)

### Migration Script Errors

**Error:** `Cannot find module` or TypeScript errors

**Solution:**
```bash
# Install dependencies
npm install

# Run with ts-node directly
npx ts-node scripts/migrate-to-supabase.ts
```

---

## Production Connection String (Render)

For Render deployment, use Supabase connection pooler:

```
postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?sslmode=require
```

**Note:** Port `6543` is for connection pooling (better for production), `5432` is direct connection.

---

## After Migration Checklist

- [ ] Schema deployed to Supabase
- [ ] All data migrated successfully
- [ ] Verified data in Supabase dashboard
- [ ] Updated Render `DATABASE_URL`
- [ ] Tested API endpoints
- [ ] Verified login works
- [ ] Tested save/search features

---

## Need Help?

1. Check Supabase logs in dashboard
2. Check Prisma migration status: `npx prisma migrate status`
3. Test connection: `npx prisma db pull` (should show your schema)






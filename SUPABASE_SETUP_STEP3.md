# Step 3: Deploy Schema to Supabase

## Important: Connection String Types

Supabase provides two types of connection strings:

1. **Connection Pooler** (port 6543) - For application use (what you have)
2. **Direct Connection** (port 5432) - For migrations and schema operations

**For Prisma schema deployment, you need the DIRECT connection (port 5432)**

---

## Option 1: Use the PowerShell Script (Easiest)

I've created a script that automatically converts your pooler URL to direct connection:

```powershell
.\scripts\deploy-schema-supabase.ps1
```

This will:
- Convert pooler URL (6543) to direct URL (5432)
- Deploy schema to Supabase
- Generate Prisma Client

---

## Option 2: Manual Setup

### Get Direct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, find **URI** section
4. Look for **"Direct connection"** (not "Connection pooling")
5. Copy that URL - it should have port **5432** (not 6543)

**Format:**
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.connect.psql.cloud:5432/postgres?sslmode=require
```

### Add to .env

Add this to your `.env` file:

```env
# Direct connection for migrations (port 5432)
SUPABASE_DIRECT_URL=postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.connect.psql.cloud:5432/postgres?sslmode=require

# Pooler connection for application (port 6543) - keep this for Render
SUPABASE_DATABASE_URL=postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Deploy Schema

```powershell
# Set direct connection as DATABASE_URL
$env:DATABASE_URL="postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.connect.psql.cloud:5432/postgres?sslmode=require"

# Push schema
npx prisma db push

# Generate client
npx prisma generate
```

---

## Quick Fix: Update Your Current URL

Your current URL uses the pooler. For schema deployment, you need to:

1. **Change port from 6543 to 5432**
2. **Change host from `pooler.supabase.com` to `connect.psql.cloud`** (or similar)
3. **Remove `pgbouncer=true`**
4. **Add `sslmode=require`**

**Your current (pooler):**
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Should be (direct):**
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.connect.psql.cloud:5432/postgres?sslmode=require
```

---

## After Schema Deployment

Once schema is deployed, you'll see:
```
✔ Your database is now in sync with your Prisma schema.
```

Then proceed to **Step 4: Migrate Data**




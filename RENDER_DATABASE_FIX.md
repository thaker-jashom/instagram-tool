# Fix Render Database Connection

## Problem
Authentication failed when connecting to Supabase from Render.

## Solution: Update DATABASE_URL in Render

### Step 1: Get the Correct Connection String

For Render (production), you need to use the **Supabase Connection Pooler** with these settings:
- **Port:** 6543 (NOT 5432)
- **Parameter:** `?pgbouncer=true` (NOT `?sslmode=require`)

### Step 2: Update Render Environment Variable

1. Go to **Render Dashboard** → Your Service (`food-influencer-api`)
2. Click on **Environment** tab
3. Find or add `DATABASE_URL`
4. Update it with this value (try Option A first, then Option B if needed):

**Option A: Direct Connection (Recommended for Prisma)**
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Option B: Pooler Connection (if Option A doesn't work)**
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Important Notes:**
- **Option A uses port 5432** (direct connection) - Prisma works best with this
- **Option B uses port 6543** (pooler) - NO `?pgbouncer=true` parameter (Prisma doesn't support it)
- Make sure there are NO quotes around the value in Render
- Make sure there are NO extra spaces before or after the connection string

### Step 3: Save and Redeploy

1. Click **Save Changes**
2. Render will automatically redeploy, OR
3. Click **Manual Deploy** → **Deploy latest commit**

### Step 4: Verify Connection

After redeploy, check the logs. You should see:
```
✅ PostgreSQL connected via Prisma
```

Instead of the authentication error.

---

## Alternative: If Authentication Still Fails

If you still get authentication errors, the password might need URL encoding. Try this:

1. Go to Supabase Dashboard → Settings → Database
2. Click **"Reset database password"** (if needed)
3. Copy the **Connection Pooling** URI (not Direct Connection)
4. Use that exact string in Render's `DATABASE_URL`

The connection string from Supabase dashboard should look like:
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Quick Reference: Connection String Formats

### For Render (Production) - Use Pooler:
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### For Local Development/Prisma Studio - Use Direct:
```
postgresql://postgres.zwwstfwbwcgnxtiljwat:S2hM0WfNv1kDn1VC@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Key Differences:**
- Production: Port **6543** + `?pgbouncer=true`
- Local: Port **5432** + `?sslmode=require`


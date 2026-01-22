# Render Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Login to Render Dashboard
- Go to https://render.com
- Sign in to your account

### 2. Create New Web Service
- Click **"New +"** button
- Select **"Web Service"**
- Connect your Git repository (GitHub/GitLab/Bitbucket)
- Select your repository: `food-influencer-api`
- Click **"Connect"**

### 3. Configure Service (DO NOT DEPLOY YET)
Fill in the following:

**Basic Settings:**
- **Name**: `food-influencer-api` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or `./`)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**⚠️ IMPORTANT - Disable Auto-Deploy:**
- Scroll down to **"Auto-Deploy"** section
- Toggle **"Auto-Deploy"** to **OFF**
- This prevents automatic deployments

### 4. Add Environment Variables

Click on **"Environment"** tab or scroll to **"Environment Variables"** section.

Add each variable by clicking **"Add Environment Variable"**:

#### Required Variables:

```
NODE_ENV=production
```

```
PORT=10000
```
*(Render automatically sets PORT, but you can override it)*

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```
*(Your PostgreSQL connection string - get this from your database provider)*

```
JWT_SECRET=your-super-secret-jwt-key-here-min-32-characters
```
*(Generate a strong random string - at least 32 characters)*

#### Optional Variables (for API integrations):

```
RAPIDAPI_KEY=your-rapidapi-key-here
```

```
RAPIDAPI_INSTAGRAM_HOST=instagram120.p.rapidapi.com
```

```
YOUTUBE_API_KEY=your-youtube-api-key-here
```

```
LOG_LEVEL=info
```
*(Options: error, warn, info, debug)*

### 5. Save Configuration (DO NOT CLICK DEPLOY)

- Click **"Save Changes"** or **"Apply"**
- Your service will be created but NOT deployed
- Status will show as "Not Deployed" or "Manual Deploy"

### 6. Verify Environment Variables

- Go to your service dashboard
- Click **"Environment"** tab
- Verify all variables are listed correctly
- Check that values are set (they show as dots for security)

### 7. When Ready to Deploy

When you're ready to deploy later:
- Go to your service dashboard
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Or push a new commit (if you enable auto-deploy later)

---

## Quick Reference: All Environment Variables

Copy-paste this list when adding variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-jwt-secret-key-min-32-chars
RAPIDAPI_KEY=your-rapidapi-key
RAPIDAPI_INSTAGRAM_HOST=instagram120.p.rapidapi.com
YOUTUBE_API_KEY=your-youtube-api-key
LOG_LEVEL=info
```

---

## Important Notes:

1. **Never commit `.env` file** - Environment variables in Render are secure
2. **JWT_SECRET** - Use a strong random string (you can generate with: `openssl rand -base64 32`)
3. **DATABASE_URL** - Format: `postgresql://username:password@host:port/database`
4. **Auto-Deploy OFF** - Service won't deploy until you manually trigger it
5. **Test locally first** - Make sure your `.env` file works locally before deploying

---

## Troubleshooting:

- **Can't find Environment Variables section?** - Make sure you're in the service settings, not the dashboard
- **Variables not saving?** - Check if you have proper permissions on the service
- **Need to update a variable?** - Edit it in the Environment tab and save


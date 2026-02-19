# Quick Fix - API Endpoints Not Working

## The Problem
Your frontend is calling: `https://instagram-tool-1.onrender.com/auth/register`
But it should be calling: `https://instagram-tool-1.onrender.com/api/v1/auth/register`

## The Solution (2 Minutes)

### Step 1: Fix Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar
5. Find `VITE_API_BASE_URL` or add it if missing
6. Set the value to:
   ```
   https://instagram-tool-1.onrender.com/api/v1
   ```
7. Make sure it's checked for: Production, Preview, Development
8. Click "Save"

### Step 2: Redeploy

1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click the three dots (⋯) menu
4. Click "Redeploy"
5. **IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click "Redeploy"

### Step 3: Wait & Test

1. Wait 2-3 minutes for deployment
2. Open your Vercel app
3. Press Ctrl+Shift+R (hard refresh)
4. Try to register/login
5. Should work now!

## Verify It's Fixed

Open browser console (F12) and run:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

Should show: `https://instagram-tool-1.onrender.com/api/v1`

If it shows `undefined` or `http://localhost:3000/api/v1`, the environment variable wasn't set correctly.

## All Your API Endpoints

Your backend has these endpoints (all working):

**Authentication:**
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

**Influencers:**
- POST `/api/v1/instagram/fetch`
- POST `/api/v1/youtube/fetch`

**Saved Data:**
- GET `/api/v1/saved-influencers`
- POST `/api/v1/saved-influencers/bulk`
- DELETE `/api/v1/saved-influencers/:id`
- GET `/api/v1/saved-searches`
- POST `/api/v1/saved-searches`

All frontend code is correct - it's just the environment variable that needs to be set!

## Still Not Working?

If after following the steps above it still doesn't work:

1. **Check Vercel Build Logs:**
   - Go to Deployments → Click latest → View "Building" logs
   - Look for environment variable being set

2. **Check Network Tab:**
   - F12 → Network tab
   - Try to register
   - Click the failed request
   - Check the "Request URL" - should have `/api/v1` in it

3. **Clear Everything:**
   - Close browser completely
   - Reopen in incognito mode
   - Try again

4. **Verify Backend:**
   - Open: https://instagram-tool-1.onrender.com/
   - Should show API info with all endpoints
   - Open: https://instagram-tool-1.onrender.com/health
   - Should show: `{"status":"ok"}`

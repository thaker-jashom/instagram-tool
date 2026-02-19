# Deploy Now - Complete Setup Guide

## What I've Fixed

1. ✅ Updated `frontend/.env` to point to your Render backend
2. ✅ Updated `frontend/.env.example` with production URL
3. ✅ Enhanced backend CORS to allow all Vercel deployments
4. ✅ Added better CORS debugging

## Step-by-Step Deployment

### Step 1: Deploy Backend to Render

```bash
# Commit the CORS changes
git add src/app.ts
git commit -m "Fix CORS for Vercel deployments"
git push origin main
```

Render will automatically detect the push and redeploy (takes 2-3 minutes).

### Step 2: Set Environment Variable in Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click "Settings" tab
4. Click "Environment Variables" in the left sidebar
5. Add or update:
   ```
   Name: VITE_API_BASE_URL
   Value: https://instagram-tool-1.onrender.com/api/v1
   ```
6. Check all three: ✓ Production ✓ Preview ✓ Development
7. Click "Save"

**Option B: Via Vercel CLI**

```bash
cd frontend
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://instagram-tool-1.onrender.com/api/v1

vercel env add VITE_API_BASE_URL preview
# When prompted, enter: https://instagram-tool-1.onrender.com/api/v1

vercel env add VITE_API_BASE_URL development
# When prompted, enter: https://instagram-tool-1.onrender.com/api/v1
```

### Step 3: Deploy Frontend to Vercel

**Option A: Git Push (Automatic)**

```bash
# Commit the environment file changes
git add frontend/.env frontend/.env.example
git commit -m "Update API URL for production"
git push origin main
```

Vercel will automatically deploy (takes 1-2 minutes).

**Option B: Manual Redeploy**

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click on the latest deployment
4. Click three dots (⋯) → "Redeploy"
5. **IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click "Redeploy"

**Option C: Vercel CLI**

```bash
cd frontend
vercel --prod
```

### Step 4: Set Backend Environment Variable (Optional but Recommended)

In Render Dashboard:

1. Go to your backend service
2. Click "Environment" tab
3. Add:
   ```
   Name: FRONTEND_URL
   Value: https://your-app-name.vercel.app
   ```
   (Replace with your actual Vercel URL)
4. Click "Save"

Backend will auto-redeploy.

### Step 5: Test Everything

1. **Wait for deployments to complete** (3-5 minutes total)

2. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"

3. **Test in incognito mode:**
   - Open incognito window
   - Go to your Vercel URL
   - Try to register

4. **Check the Network tab:**
   - Press F12
   - Go to Network tab
   - Try to register
   - Look at the request URL
   - Should be: `https://instagram-tool-1.onrender.com/api/v1/auth/register`

5. **Verify environment variable:**
   - Open browser console (F12)
   - Type: `console.log(import.meta.env.VITE_API_BASE_URL)`
   - Should show: `https://instagram-tool-1.onrender.com/api/v1`

## Quick Test Commands

### Test Backend Directly

```bash
# Health check
curl https://instagram-tool-1.onrender.com/health

# API info
curl https://instagram-tool-1.onrender.com/

# Test register endpoint
curl -X POST https://instagram-tool-1.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test123@example.com","password":"Test@123","firstName":"Test","lastName":"User"}'
```

### Test Frontend

1. Open: https://your-app.vercel.app
2. Open DevTools (F12) → Console
3. Run: `console.log(import.meta.env.VITE_API_BASE_URL)`
4. Should output: `https://instagram-tool-1.onrender.com/api/v1`

## Troubleshooting

### Issue 1: Still seeing CORS error

**Check:**
- Backend deployed successfully on Render?
- Frontend deployed successfully on Vercel?
- Environment variable set in Vercel?
- Cleared browser cache?

**Solution:**
```bash
# Redeploy both
git add .
git commit -m "Force redeploy"
git push origin main
```

### Issue 2: Environment variable not working

**Check in Vercel:**
1. Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` exists
3. Verify it's checked for all environments
4. Verify the value is correct (with `/api/v1`)

**Then:**
1. Go to Deployments
2. Redeploy WITHOUT cache

### Issue 3: 404 Not Found

**Check:**
- Is the endpoint correct?
- Does it have `/api/v1` prefix?
- Is the backend running?

**Test:**
```bash
curl https://instagram-tool-1.onrender.com/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@foodai.com","password":"Test@123"}'
```

### Issue 4: Backend is sleeping

Render free tier sleeps after 15 minutes of inactivity.

**Solution:**
- First request will take 30-60 seconds to wake up
- Subsequent requests will be fast
- This is normal behavior

## Verification Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check works: `https://instagram-tool-1.onrender.com/health`
- [ ] Frontend deployed on Vercel
- [ ] Environment variable set in Vercel: `VITE_API_BASE_URL`
- [ ] Environment variable value: `https://instagram-tool-1.onrender.com/api/v1`
- [ ] Browser cache cleared
- [ ] Tested in incognito mode
- [ ] Registration works
- [ ] Login works
- [ ] All features work

## Expected Results

After following all steps:

✅ Registration works
✅ Login works
✅ Fetch influencers works
✅ Save influencers works
✅ View saved influencers works
✅ All API calls successful
✅ No CORS errors
✅ No 404 errors

## Support

If you're still having issues after following all steps:

1. **Check Render Logs:**
   - Go to Render Dashboard
   - Click your service
   - Click "Logs" tab
   - Look for errors

2. **Check Vercel Logs:**
   - Go to Vercel Dashboard
   - Click your project
   - Click "Deployments"
   - Click latest deployment
   - Check "Building" and "Functions" logs

3. **Check Browser Console:**
   - F12 → Console tab
   - Look for errors
   - Check Network tab for failed requests

## Summary

**What was fixed:**
- Backend CORS now allows all Vercel deployments
- Frontend `.env` updated to production URL
- Better error handling and debugging

**What you need to do:**
1. Push code to GitHub (triggers auto-deploy)
2. Set `VITE_API_BASE_URL` in Vercel
3. Wait for deployments
4. Test in incognito mode

**Time required:** 5-10 minutes

After this, your application will be fully functional in production!

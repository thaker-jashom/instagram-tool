# Deployment Guide - Connect Frontend (Vercel) to Backend (Render)

## Backend Setup (Render) ✅ DONE
Your backend is live at: `https://instagram-tool-1.onrender.com`

## Frontend Setup (Vercel)

### Step 1: Update Frontend Environment Variable

You need to set the environment variable in Vercel to point to your Render backend.

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add a new environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://instagram-tool-1.onrender.com/api/v1`
   - **Environment**: Select all (Production, Preview, Development)
5. Click "Save"

**Option B: Via Vercel CLI**

```bash
vercel env add VITE_API_BASE_URL
# When prompted, enter: https://instagram-tool-1.onrender.com/api/v1
# Select all environments
```

### Step 2: Redeploy Frontend

After adding the environment variable, you need to redeploy:

**Option A: Via Vercel Dashboard**
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click the three dots menu (⋯)
4. Click "Redeploy"
5. Check "Use existing Build Cache" (optional)
6. Click "Redeploy"

**Option B: Via Git Push**
```bash
cd frontend
git add .
git commit -m "Update API URL for production" --allow-empty
git push
```

**Option C: Via Vercel CLI**
```bash
cd frontend
vercel --prod
```

### Step 3: Configure CORS on Backend (Render)

You need to allow your Vercel frontend URL in the backend CORS settings.

1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Add/Update these environment variables:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://your-app-name.vercel.app` (replace with your actual Vercel URL)

5. Update your backend CORS configuration to use this variable

### Step 4: Test the Connection

After deployment, test these endpoints:

1. **Health Check**: 
   - Open: `https://instagram-tool-1.onrender.com/api/v1/health`
   - Should return: `{"status":"ok"}`

2. **Frontend Login**:
   - Open your Vercel app
   - Try to login with: `test@foodai.com` / `Test@123`
   - Check browser console (F12) for any CORS or network errors

### Step 5: Verify Environment Variables

Check if the environment variable is loaded correctly:

1. Open your Vercel app
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_API_BASE_URL`
4. Should show: `https://instagram-tool-1.onrender.com/api/v1`

## Common Issues & Solutions

### Issue 1: CORS Error
**Error**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: 
- Make sure `FRONTEND_URL` is set in Render environment variables
- Check backend CORS configuration allows your Vercel domain
- Redeploy backend after updating CORS settings

### Issue 2: 404 Not Found
**Error**: API endpoints return 404

**Solution**:
- Verify the API URL includes `/api/v1` at the end
- Check backend routes are properly registered
- Test backend directly: `https://instagram-tool-1.onrender.com/api/v1/health`

### Issue 3: Environment Variable Not Working
**Error**: API calls go to localhost instead of Render

**Solution**:
- Verify environment variable name is exactly `VITE_API_BASE_URL` (case-sensitive)
- Redeploy frontend after adding environment variable
- Clear Vercel build cache and redeploy

### Issue 4: Backend Cold Start
**Issue**: First request takes 30-60 seconds

**Solution**:
- This is normal for Render free tier (backend sleeps after inactivity)
- Consider upgrading to paid plan for always-on service
- Or implement a keep-alive ping service

## Quick Checklist

- [ ] Backend deployed on Render: `https://instagram-tool-1.onrender.com`
- [ ] Backend health check works: `/api/v1/health`
- [ ] Environment variable added in Vercel: `VITE_API_BASE_URL`
- [ ] Frontend redeployed on Vercel
- [ ] CORS configured on backend to allow Vercel domain
- [ ] Test login works on production
- [ ] Test API calls work (fetch influencers, save, etc.)

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1
```

### Backend (Render)
```
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
RAPIDAPI_KEY=your_rapidapi_key
YOUTUBE_API_KEY=your_youtube_api_key
FRONTEND_URL=https://your-app-name.vercel.app
PORT=3000
NODE_ENV=production
```

## Next Steps After Deployment

1. **Test all features**:
   - Registration
   - Login
   - Fetch YouTube influencers
   - Fetch Instagram influencers
   - Save influencers
   - View saved influencers
   - Remove saved influencers

2. **Monitor logs**:
   - Render: Check backend logs for errors
   - Vercel: Check function logs for frontend errors

3. **Set up custom domain** (optional):
   - Add custom domain in Vercel
   - Update CORS settings in backend

4. **Enable analytics** (optional):
   - Vercel Analytics
   - Error tracking (Sentry, etc.)

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

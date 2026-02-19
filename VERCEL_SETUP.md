# Vercel Frontend Deployment - Quick Setup

## Step-by-Step Instructions

### 1. Add Environment Variable in Vercel

Go to your Vercel project → Settings → Environment Variables

Add this variable:

```
Name: VITE_API_BASE_URL
Value: https://instagram-tool-1.onrender.com/api/v1
Environments: ✓ Production ✓ Preview ✓ Development
```

### 2. Add Environment Variable in Render (Backend)

Go to your Render service → Environment

Add this variable:

```
Name: FRONTEND_URL
Value: https://your-vercel-app.vercel.app
```

**Important**: Replace `your-vercel-app` with your actual Vercel app name.

To find your Vercel URL:
- Go to Vercel dashboard
- Click on your project
- Copy the URL shown (e.g., `https://food-influencer.vercel.app`)

### 3. Redeploy Both Services

**Backend (Render):**
- After adding `FRONTEND_URL`, Render will auto-redeploy
- Wait for deployment to complete (~2-3 minutes)

**Frontend (Vercel):**
- Go to Deployments tab
- Click "Redeploy" on the latest deployment
- OR push a new commit to trigger deployment

### 4. Test the Connection

**Test Backend:**
```bash
curl https://instagram-tool-1.onrender.com/api/v1/health
```
Should return: `{"status":"ok"}`

**Test Frontend:**
1. Open your Vercel app URL
2. Open browser console (F12)
3. Go to Network tab
4. Try to login
5. Check if API calls go to `https://instagram-tool-1.onrender.com`

### 5. Verify Everything Works

Test these features:
- ✓ Registration
- ✓ Login
- ✓ Fetch YouTube influencers
- ✓ Fetch Instagram influencers
- ✓ Save influencers
- ✓ View saved influencers
- ✓ Remove saved influencers

## Troubleshooting

### CORS Error?
1. Make sure `FRONTEND_URL` is set in Render
2. Make sure the URL matches exactly (no trailing slash)
3. Redeploy backend after adding the variable

### API calls still going to localhost?
1. Verify `VITE_API_BASE_URL` is set in Vercel
2. Redeploy frontend after adding the variable
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Backend is slow on first request?
- This is normal for Render free tier
- Backend sleeps after 15 minutes of inactivity
- First request wakes it up (~30-60 seconds)
- Subsequent requests are fast

## Summary

**Backend URL**: `https://instagram-tool-1.onrender.com`
**Frontend URL**: `https://your-app.vercel.app` (get from Vercel dashboard)

**Environment Variables:**
- Vercel: `VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1`
- Render: `FRONTEND_URL=https://your-app.vercel.app`

That's it! Your app should now be fully deployed and connected.

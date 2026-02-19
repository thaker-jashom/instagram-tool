# API Endpoints Verification & Setup

## Issue Identified
The frontend is trying to access `https://instagram-tool-1.onrender.com/auth/register` but it should be accessing `https://instagram-tool-1.onrender.com/api/v1/auth/register`.

## Root Cause
The `VITE_API_BASE_URL` environment variable in Vercel is not set correctly or is missing the `/api/v1` prefix.

## Solution

### Step 1: Update Vercel Environment Variable

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Update or Add:**
```
Name: VITE_API_BASE_URL
Value: https://instagram-tool-1.onrender.com/api/v1
Environments: ✓ Production ✓ Preview ✓ Development
```

**IMPORTANT:** The value MUST include `/api/v1` at the end!

### Step 2: Redeploy Frontend

After updating the environment variable:
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. **Uncheck "Use existing Build Cache"**
4. Click "Redeploy"

### Step 3: Update Backend CORS

Make sure your Render backend has the correct FRONTEND_URL:

```
Name: FRONTEND_URL
Value: https://your-app-name.vercel.app
```

## All API Endpoints (Backend)

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

### Influencer Endpoints
- `GET /api/v1/influencers` - Get all influencers
- `GET /api/v1/influencers/:id` - Get single influencer
- `POST /api/v1/influencers/fetch` - Fetch influencers (legacy)

### Instagram Endpoints
- `POST /api/v1/instagram/fetch` - Fetch Instagram influencers

### YouTube Endpoints
- `POST /api/v1/youtube/fetch` - Fetch YouTube influencers

### Saved Influencers Endpoints
- `POST /api/v1/saved-influencers/bulk` - Save multiple influencers
- `GET /api/v1/saved-influencers` - Get user's saved influencers
- `DELETE /api/v1/saved-influencers/:influencerId` - Remove saved influencer

### Saved Searches Endpoints
- `POST /api/v1/saved-searches` - Save a search
- `GET /api/v1/saved-searches` - Get user's saved searches

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API info and available endpoints

## Frontend API Calls (All Verified ✓)

### Navbar.jsx
```javascript
api.get('/auth/me')  // ✓ Correct
```

### Login.jsx
```javascript
api.post('/auth/login', { email, password })  // ✓ Correct
```

### Register.jsx
```javascript
api.post('/auth/register', { firstName, lastName, email, password })  // ✓ Correct
```

### FetchInfluencers.jsx
```javascript
api.post('/instagram/fetch', payload)  // ✓ Correct
api.post('/youtube/fetch', payload)  // ✓ Correct
api.post('/saved-searches', payload)  // ✓ Correct
api.post('/saved-influencers/bulk', payload)  // ✓ Correct
```

### SavedInfluencers.jsx
```javascript
api.get('/saved-influencers')  // ✓ Correct
api.delete(`/saved-influencers/${influencerId}`)  // ✓ Correct
```

### SavedSearches.jsx
```javascript
api.get('/saved-searches')  // ✓ Correct
```

## Verification

All frontend API calls are correctly implemented. They use relative paths because the axios instance has the base URL configured:

```javascript
// frontend/src/api/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // This should be: https://instagram-tool-1.onrender.com/api/v1
});
```

## Testing After Fix

### 1. Test Backend Directly
```bash
# Health check
curl https://instagram-tool-1.onrender.com/health

# API info
curl https://instagram-tool-1.onrender.com/

# Test register endpoint
curl -X POST https://instagram-tool-1.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

### 2. Test Frontend
1. Open your Vercel app
2. Open browser console (F12)
3. Go to Network tab
4. Try to register/login
5. Check the request URL - should be: `https://instagram-tool-1.onrender.com/api/v1/auth/...`

### 3. Verify Environment Variable
Open browser console and run:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```
Should output: `https://instagram-tool-1.onrender.com/api/v1`

## Common Issues

### Issue 1: Still seeing old URL
**Solution:** 
- Clear browser cache (Ctrl+Shift+R)
- Try incognito mode
- Verify Vercel redeployed successfully

### Issue 2: CORS Error
**Solution:**
- Verify `FRONTEND_URL` is set in Render
- Check backend CORS configuration
- Redeploy backend

### Issue 3: 404 Not Found
**Solution:**
- Verify the endpoint exists in backend
- Check the route is registered in `src/app.ts`
- Verify `/api/v1` prefix is in the URL

## Summary

✓ **Backend Routes:** All correctly configured with `/api/v1` prefix
✓ **Frontend API Calls:** All using correct relative paths
✓ **Axios Configuration:** Properly set up with base URL
❌ **Environment Variable:** Needs to be set in Vercel with `/api/v1` suffix

**Action Required:**
1. Set `VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1` in Vercel
2. Redeploy frontend without cache
3. Test registration/login

After these steps, all API endpoints will work correctly!

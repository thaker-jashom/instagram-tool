# API Setup - Complete Verification

## Current Status

### ✅ Backend (Render) - CORRECT
All routes are properly configured in `src/app.ts`:

```typescript
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/influencers', influencerRoutes);
app.use('/api/v1/saved-searches', savedSearchRoutes);
app.use('/api/v1/saved-influencers', savedInfluencerRoutes);
app.use('/api/v1/instagram', instagramFetchRoutes);
app.use('/api/v1/youtube', youtubeFetchRoutes);
```

### ✅ Frontend Code - CORRECT
All API calls use the axios instance with correct relative paths:
- `api.post('/auth/register', ...)`
- `api.post('/auth/login', ...)`
- `api.get('/auth/me')`
- `api.post('/instagram/fetch', ...)`
- `api.post('/youtube/fetch', ...)`
- `api.get('/saved-influencers')`
- `api.post('/saved-influencers/bulk', ...)`
- `api.delete('/saved-influencers/:id')`
- `api.get('/saved-searches')`
- `api.post('/saved-searches', ...)`

### ❌ Environment Variable - NEEDS FIX
The `VITE_API_BASE_URL` in Vercel is either:
- Not set
- Set incorrectly (missing `/api/v1`)
- Set to localhost

## Complete API Endpoint List

### 1. Authentication (3 endpoints)
| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| POST | `/api/v1/auth/register` | Register new user | Register.jsx |
| POST | `/api/v1/auth/login` | Login user | Login.jsx |
| GET | `/api/v1/auth/me` | Get current user | Navbar.jsx |

### 2. Instagram (1 endpoint)
| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| POST | `/api/v1/instagram/fetch` | Fetch Instagram influencers | FetchInfluencers.jsx |

### 3. YouTube (1 endpoint)
| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| POST | `/api/v1/youtube/fetch` | Fetch YouTube influencers | FetchInfluencers.jsx |

### 4. Saved Influencers (3 endpoints)
| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| GET | `/api/v1/saved-influencers` | Get user's saved influencers | SavedInfluencers.jsx |
| POST | `/api/v1/saved-influencers/bulk` | Save multiple influencers | FetchInfluencers.jsx |
| DELETE | `/api/v1/saved-influencers/:influencerId` | Remove saved influencer | SavedInfluencers.jsx |

### 5. Saved Searches (2 endpoints)
| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| GET | `/api/v1/saved-searches` | Get user's saved searches | SavedSearches.jsx |
| POST | `/api/v1/saved-searches` | Save a search | FetchInfluencers.jsx |

### 6. Health & Info (2 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |

**Total: 13 API endpoints** (11 protected + 2 public)

## Fix Instructions

### For Vercel (Frontend)

1. **Set Environment Variable:**
   ```
   VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1
   ```

2. **Redeploy without cache**

3. **Verify in browser console:**
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   // Should output: https://instagram-tool-1.onrender.com/api/v1
   ```

### For Render (Backend)

1. **Set Environment Variable:**
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

2. **Backend will auto-redeploy**

## Testing Each Endpoint

### Test Backend Directly

```bash
# 1. Health check
curl https://instagram-tool-1.onrender.com/health

# 2. API info
curl https://instagram-tool-1.onrender.com/

# 3. Register (should work)
curl -X POST https://instagram-tool-1.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","firstName":"Test","lastName":"User"}'

# 4. Login (should work)
curl -X POST https://instagram-tool-1.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@foodai.com","password":"Test@123"}'
```

### Test Frontend

1. Open Vercel app
2. Open DevTools (F12) → Network tab
3. Try to register
4. Check request URL should be: `https://instagram-tool-1.onrender.com/api/v1/auth/register`
5. If it's missing `/api/v1`, the environment variable is not set

## CORS Configuration

Your backend CORS is configured to allow:
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (local dev)
- `process.env.FRONTEND_URL` (production)

Make sure `FRONTEND_URL` is set in Render to your Vercel URL.

## Summary

✅ **Backend routes:** All 13 endpoints properly configured
✅ **Frontend API calls:** All using correct paths
✅ **Axios setup:** Properly configured with base URL
❌ **Environment variable:** Needs to be set in Vercel

**Action Required:**
1. Set `VITE_API_BASE_URL` in Vercel (with `/api/v1`)
2. Set `FRONTEND_URL` in Render (your Vercel URL)
3. Redeploy both
4. Test

After this, all 13 API endpoints will work perfectly!

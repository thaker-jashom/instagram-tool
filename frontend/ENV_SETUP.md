# Frontend Environment Variables Setup Guide

## Overview
The frontend uses Vite, which requires the `VITE_` prefix for environment variables that should be exposed to the client-side code.

## Setup Instructions

### 1. Create Environment Files

Create these files in the `frontend/` directory:

#### `.env` (Local Development)
```env
# API Base URL for local development
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

#### `.env.production` (Production Build)
```env
# API Base URL for production (Render deployment)
VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1
```

#### `.env.example` (Template - commit this to git)
```env
# Frontend Environment Variables
# Copy this file to .env and update with your values

# API Base URL
# For local development:
VITE_API_BASE_URL=http://localhost:3000/api/v1

# For production (Render deployment):
# VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1

# Note: Vite requires VITE_ prefix for environment variables exposed to client
```

### 2. Usage in Code

The environment variable is already configured in `src/api/axios.js`:

```javascript
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
```

### 3. Quick Setup Commands

**For Local Development:**
```bash
cd frontend
echo "VITE_API_BASE_URL=http://localhost:3000/api/v1" > .env
```

**For Production:**
```bash
cd frontend
echo "VITE_API_BASE_URL=https://instagram-tool-1.onrender.com/api/v1" > .env.production
```

### 4. Environment Variable Priority

Vite loads environment variables in this order:
1. `.env.production.local` (highest priority, not committed)
2. `.env.production` (production build)
3. `.env.local` (local overrides, not committed)
4. `.env` (default, not committed)

### 5. For Render Deployment

If deploying frontend to Render:

1. Go to your Render service → Environment tab
2. Add environment variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://instagram-tool-1.onrender.com/api/v1`
3. Save and redeploy

### 6. Verify Setup

After setting up, verify it works:

```bash
# Start dev server
npm run dev

# Check browser console - should see API calls going to the correct URL
```

## Current Configuration

- **Development:** `http://localhost:3000/api/v1`
- **Production:** `https://instagram-tool-1.onrender.com/api/v1`

## Troubleshooting

- **Variable not working?** Make sure it starts with `VITE_` prefix
- **Still using localhost?** Check that `.env.production` exists for production builds
- **Build not picking up changes?** Restart the dev server after changing `.env` files






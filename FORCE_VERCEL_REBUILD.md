# Force Vercel to Rebuild - Complete Guide

## The Problem
Vercel is serving cached/old JavaScript files. The email lowercase conversion works on localhost but not on Vercel live.

## Solution: Force Complete Rebuild

### Step 1: Add vercel.json (Already Done ✓)
A `vercel.json` file has been created in the `frontend` folder.

### Step 2: Commit ALL Changes
```bash
# Make sure you're in the project root
cd your-project-folder

# Add all files
git add .

# Commit with a clear message
git commit -m "Force rebuild - fix email validation on production"

# Push to repository
git push origin main
```

### Step 3: Delete Vercel Deployment Cache

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click "Settings" tab
4. Scroll down to "Danger Zone"
5. Click "Delete Project Cache"
6. Confirm deletion

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login
vercel login

# Link to your project
cd frontend
vercel link

# Delete cache and redeploy
vercel --force
```

### Step 4: Trigger Fresh Deployment

After deleting cache:

1. Go to "Deployments" tab
2. Click "Redeploy" on latest deployment
3. **IMPORTANT**: Uncheck "Use existing Build Cache"
4. Click "Redeploy"

### Step 5: Verify Build Settings

In Vercel Dashboard → Settings → General:

**Framework Preset:** Vite
**Build Command:** `npm run build` or `cd frontend && npm run build`
**Output Directory:** `dist` or `frontend/dist`
**Install Command:** `npm install`
**Root Directory:** `frontend` (if your frontend is in a subfolder)

### Step 6: Check Environment Variables

Go to Settings → Environment Variables

Make sure this is set:
```
VITE_API_BASE_URL = https://instagram-tool-1.onrender.com/api/v1
```

For ALL environments (Production, Preview, Development)

### Step 7: Wait for Build to Complete

- Build typically takes 1-3 minutes
- Watch the build logs in real-time
- Look for any errors or warnings

### Step 8: Clear Browser Cache COMPLETELY

**Chrome/Edge:**
1. Press F12 (DevTools)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Close DevTools
5. Close browser completely
6. Reopen browser
7. Go to your Vercel URL

**Firefox:**
1. Press Ctrl+Shift+Delete
2. Select "Everything" for time range
3. Check "Cache" and "Cookies"
4. Click "Clear Now"
5. Close and reopen browser

**Safari:**
1. Develop → Empty Caches
2. Close and reopen browser

### Step 9: Test in Incognito/Private Mode

This is the BEST way to test:
1. Open Incognito/Private window
2. Go to your Vercel URL
3. Go to Register page
4. Type "TEST@EXAMPLE.COM" in email field
5. Should show "test@example.com"

### Step 10: Verify JavaScript is Updated

1. Open your Vercel app
2. Press F12 (DevTools)
3. Go to "Sources" tab
4. Find the main JavaScript bundle (usually in `assets` folder)
5. Search for "toLowerCase" in the file
6. You should find the email conversion code

## Alternative: Create New Deployment

If the above doesn't work:

### Method 1: Change Something in Code
```bash
# Add a comment or space to trigger rebuild
# Edit frontend/src/pages/Register.jsx
# Add a comment at the top: // Force rebuild

git add .
git commit -m "Trigger rebuild"
git push
```

### Method 2: Redeploy from Git
1. Go to Vercel Dashboard
2. Deployments tab
3. Click "..." menu on any deployment
4. Select "Redeploy"
5. Uncheck cache
6. Click "Redeploy"

### Method 3: Delete and Reconnect Project
1. Go to Settings → General
2. Scroll to "Delete Project"
3. Delete the project
4. Import the project again from Git
5. Configure settings
6. Deploy

## Debugging: Check What's Actually Deployed

### Check 1: View Deployment Source
1. Go to Vercel Dashboard
2. Click on latest deployment
3. Click "Source" tab
4. Navigate to `src/pages/Register.jsx`
5. Verify the code has `value.toLowerCase()`

### Check 2: Check Build Logs
1. Click on deployment
2. Click "Building" section
3. Look for:
   - "Build Completed" message
   - No errors
   - Correct output directory

### Check 3: Test API Endpoint
Open browser console and run:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```
Should show: `https://instagram-tool-1.onrender.com/api/v1`

## Common Issues

### Issue 1: Root Directory Wrong
**Symptom:** Build fails or deploys wrong folder

**Solution:**
- Settings → General → Root Directory
- Set to `frontend` if your code is in a subfolder
- Or leave blank if frontend code is in root

### Issue 2: Build Command Wrong
**Symptom:** Build succeeds but app doesn't work

**Solution:**
- If frontend is in subfolder: `cd frontend && npm run build`
- If frontend is in root: `npm run build`

### Issue 3: Output Directory Wrong
**Symptom:** 404 errors on deployed site

**Solution:**
- If frontend in subfolder: `frontend/dist`
- If frontend in root: `dist`

### Issue 4: Environment Variables Not Set
**Symptom:** API calls fail or go to localhost

**Solution:**
- Add `VITE_API_BASE_URL` in Settings → Environment Variables
- Redeploy after adding

## Final Checklist

- [ ] Code pushed to Git repository
- [ ] vercel.json file exists in frontend folder
- [ ] Vercel cache deleted
- [ ] Redeployed without cache
- [ ] Build completed successfully (check logs)
- [ ] Browser cache cleared completely
- [ ] Tested in incognito mode
- [ ] Email converts to lowercase when typing uppercase

## Still Not Working?

If you've done ALL of the above:

1. **Share your Vercel URL** - I can check what's deployed
2. **Check browser console** - Look for JavaScript errors
3. **Try different browser** - Test in Chrome, Firefox, Safari
4. **Check Network tab** - See which JS files are loaded
5. **Contact Vercel support** - They can check server-side cache

## Expected Result

When you type in the email field:
- Input: "TEST@EXAMPLE.COM"
- Display: "test@example.com"
- No error messages
- Form submits successfully

# Quick Start - Fetch Influencers from Instagram & YouTube

## 🎯 What Was Fixed

Your dashboard can now fetch influencers from BOTH Instagram and YouTube! The routes were missing, now they're connected.

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Get API Keys

**Instagram (RapidAPI):**
- Go to https://rapidapi.com/
- Subscribe to "Instagram Scraper Stable API"
- Copy your API key

**YouTube (Google):**
- Go to https://console.cloud.google.com/
- Enable "YouTube Data API v3"
- Create API key

### 2️⃣ Update .env File

```env
# Instagram
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_INSTAGRAM_HOST=instagram-scraper-stable-api.p.rapidapi.com

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3️⃣ Test & Run

```bash
# Test if APIs work
npm run test:apis

# Start the server
npm run dev
```

## ✅ What's Working Now

| Feature | Status | Endpoint |
|---------|--------|----------|
| Instagram Fetch | ✅ Working | `POST /api/v1/instagram/fetch` |
| YouTube Fetch | ✅ Working | `POST /api/v1/youtube/fetch` |
| Save Searches | ✅ Working | `POST /api/v1/saved-searches` |
| Frontend UI | ✅ Working | Platform selector dropdown |

## 🎨 Using the Frontend

1. Open your frontend app
2. Go to "Fetch Influencers" page
3. Select platform: **Instagram** or **YouTube**
4. Enter hashtags (e.g., "food", "mumbai")
5. Set follower range (optional)
6. Click "Search"
7. Save influencers you like!

## 📊 API Comparison

| Feature | Instagram | YouTube |
|---------|-----------|---------|
| API Provider | RapidAPI | Google |
| Search By | Hashtags | Keywords |
| Returns | Profiles | Channels |
| Free Tier | Limited | 10,000 units/day |
| Cost | $10-50/month | Free (mostly) |

## 🔍 Testing

### Quick Test
```bash
npm run test:apis
```

### Manual Test (Instagram)
```bash
curl -X POST http://localhost:3000/api/v1/instagram/fetch \
  -H "Content-Type: application/json" \
  -d '{"hashtags": ["food"], "minFollowers": 1000}'
```

### Manual Test (YouTube)
```bash
curl -X POST http://localhost:3000/api/v1/youtube/fetch \
  -H "Content-Type: application/json" \
  -d '{"hashtags": ["food"], "minFollowers": 1000}'
```

## 🚨 Troubleshooting

**"Instagram not working"**
- Check RAPIDAPI_KEY in .env
- Verify you're subscribed to the API on RapidAPI
- Check quota limits

**"YouTube not working"**
- Check YOUTUBE_API_KEY in .env
- Verify YouTube Data API v3 is enabled
- Check daily quota (10,000 units)

**"Routes not found"**
- Restart the server after updating .env
- Check server is running on correct port

## 📚 More Help

- **Detailed Setup**: See `API_SETUP_GUIDE.md`
- **What Changed**: See `FIXES_APPLIED.md`
- **Logs**: Check `logs/combined.log`

## 🎉 You're All Set!

Both Instagram and YouTube fetching should work now. Just add your API keys and you're good to go!

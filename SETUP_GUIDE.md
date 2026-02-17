# Food Influencer Discovery System - Setup Guide

## Overview

A full-stack application for discovering and managing food influencers from YouTube and Instagram.

## Features

- ✅ YouTube influencer discovery (Google YouTube Data API v3)
- ✅ Instagram influencer discovery (Instagram120 RapidAPI)
- ✅ User authentication (JWT)
- ✅ Save searches and influencers
- ✅ Filter by follower count, location
- ✅ PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js 18+
- PostgreSQL database
- YouTube API key (Google Cloud)
- RapidAPI key with Instagram120 subscription

## Installation

### 1. Clone and Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Database Setup

Create a PostgreSQL database and update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/food_influencer"
DIRECT_URL="postgresql://user:password@localhost:5432/food_influencer"
```

Push the schema:

```bash
npx prisma db push
npx prisma generate
```

### 3. API Keys Configuration

Update `.env` with your API keys:

```env
# YouTube (Google Cloud Console)
YOUTUBE_API_KEY=your_youtube_api_key

# Instagram (RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_INSTAGRAM_HOST=instagram120.p.rapidapi.com

# Authentication
JWT_SECRET=your_random_secret_key

# Server
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

### 4. Create Initial User

```bash
npm run create:user
```

This creates a test user:
- Email: `test@foodai.com`
- Password: `Test@123`

## Running the Application

### Development Mode

**Backend:**
```bash
npm run dev
```
Server runs on http://localhost:3000

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### Influencer Discovery
- `POST /api/v1/youtube/fetch` - Fetch YouTube influencers
- `POST /api/v1/instagram/fetch` - Fetch Instagram influencers

### Saved Data
- `POST /api/v1/saved-searches` - Save search criteria
- `GET /api/v1/saved-searches` - Get saved searches
- `POST /api/v1/saved-influencers/bulk` - Save influencers
- `GET /api/v1/saved-influencers` - Get saved influencers

### Health Check
- `GET /health` - Server health status

## Usage

### 1. Login
Navigate to the frontend and login with your credentials.

### 2. Fetch Influencers

**YouTube:**
- Select "YouTube" platform
- Enter keywords: food, cooking, chef
- Set follower range (optional)
- Click "Search YouTube"

**Instagram:**
- Select "Instagram" platform
- Enter keywords: food, chef, foodblogger
- Set follower range (optional)
- Click "Search Instagram"

### 3. Save Results

- Click "Save Search" to save search criteria
- Click "Save Influencer" on any result card
- View saved data in respective pages

## Useful Scripts

```bash
# Database
npm run db:push          # Push schema changes
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio

# User Management
npm run create:user      # Create/reset test user

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
```

## API Quotas

### YouTube Data API v3
- **Free Tier:** 10,000 units/day
- **Search:** ~100 units per request
- **Channel Details:** ~50 units per request
- **Very generous for most use cases**

### Instagram120 (RapidAPI)
- **Basic (Free):** 100 requests/month
- **Pro:** 1,000 requests/month - $50/month
- **Each profile fetch:** 1 request

**Note:** Instagram120 doesn't have hashtag search. The system uses a curated list of popular food influencers.

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db push
```

### API Key Issues
- Verify keys are correct in `.env`
- Check API subscriptions are active
- Restart server after changing `.env`

### Login Issues
```bash
# Reset user
npm run create:user
```

### Port Already in Use
Change `PORT` in `.env` to a different port (e.g., 3001)

## Project Structure

```
food-influencer-api/
├── src/
│   ├── adapters/          # API adapters (Instagram, YouTube)
│   ├── api/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── routes/        # API routes
│   │   └── validators/    # Request validation
│   ├── config/            # Configuration files
│   ├── scripts/           # Utility scripts
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
├── frontend/              # React frontend
├── prisma/                # Database schema
└── logs/                  # Application logs
```

## Environment Variables

See `.env.example` for all available environment variables.

## Security Notes

- Never commit `.env` file
- Use strong JWT_SECRET in production
- Rotate API keys regularly
- Use environment-specific configurations

## Support

For issues or questions:
1. Check logs in `logs/combined.log`
2. Verify API quotas on respective dashboards
3. Ensure database is accessible

## License

ISC

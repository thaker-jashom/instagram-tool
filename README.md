# Food Influencer Discovery System

A full-stack application for discovering and managing food influencers from YouTube and Instagram.

## Features

- 🎥 **YouTube Discovery** - Find food channels using Google's YouTube Data API
- 📸 **Instagram Discovery** - Find food influencers using Instagram120 API
- 🔐 **Authentication** - Secure JWT-based user authentication
- 💾 **Save & Manage** - Save searches and favorite influencers
- 🔍 **Advanced Filters** - Filter by followers, location, and more
- 📊 **Database** - PostgreSQL with Prisma ORM

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- React + Vite
- Axios for API calls
- React Router

### APIs
- YouTube Data API v3 (Google)
- Instagram120 API (RapidAPI)

## Quick Start

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Setup Database
```bash
# Create PostgreSQL database
# Update DATABASE_URL in .env

npx prisma db push
npx prisma generate
```

### 3. Configure API Keys
Create `.env` file (see `.env.example`):
```env
YOUTUBE_API_KEY=your_youtube_key
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_INSTAGRAM_HOST=instagram120.p.rapidapi.com
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

### 4. Create User
```bash
npm run create:user
```

### 5. Run Application
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd frontend && npm run dev
```

Visit http://localhost:5173

## Default Login

- **Email:** test@foodai.com
- **Password:** Test@123

## Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Success Guide](SUCCESS_INSTAGRAM_WORKING.md) - API configuration details
- [Quick Start](QUICK_START.md) - Quick reference guide

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/youtube/fetch` | POST | Fetch YouTube influencers |
| `/api/v1/instagram/fetch` | POST | Fetch Instagram influencers |
| `/api/v1/saved-searches` | GET/POST | Manage saved searches |
| `/api/v1/saved-influencers` | GET/POST | Manage saved influencers |

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run create:user      # Create/reset test user
npm run db:push          # Push database schema
npm run db:studio        # Open Prisma Studio
```

## Project Structure

```
├── src/
│   ├── adapters/        # API integrations
│   ├── api/             # Routes, controllers, middleware
│   ├── config/          # Configuration
│   ├── scripts/         # Utility scripts
│   ├── services/        # Business logic
│   └── utils/           # Helpers
├── frontend/            # React application
├── prisma/              # Database schema
└── logs/                # Application logs
```

## API Quotas

- **YouTube:** 10,000 units/day (free)
- **Instagram:** 100 requests/month (free tier)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues or questions, check:
- [Setup Guide](SETUP_GUIDE.md)
- Application logs in `logs/`
- API dashboards for quota status

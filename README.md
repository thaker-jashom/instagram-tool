# 🍽️ Food Influencer Discovery Platform

A premium full-stack application for discovering and managing food influencers across Instagram and YouTube platforms.

## ✨ Features

- 🔍 **Smart Search** - Discover influencers on Instagram and YouTube
- 💾 **Save & Organize** - Save favorite influencers to your account
- 📊 **Detailed Analytics** - View comprehensive influencer statistics
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Fully Responsive** - Beautiful design on mobile, tablet, and desktop
- 🎨 **Premium UI** - Dark theme with gold accents and smooth animations
- 👤 **Profile Management** - User profile with account information

## 🚀 Live Demo

- **Backend:** https://instagram-tool-1.onrender.com
- **Frontend:** Deploy on Vercel

## 🛠️ Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- React 18
- Vite
- React Router v6
- Axios

### APIs
- YouTube Data API v3 (Google)
- Instagram120 API (RapidAPI)

## 📋 Quick Start

### For Development
See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed local setup instructions.

### For Deployment
See [FINAL_DEPLOYMENT_CHECKLIST.md](./FINAL_DEPLOYMENT_CHECKLIST.md) for production deployment.

## 🔑 Default Login

- **Email:** test@foodai.com
- **Password:** Test@123

## 📚 Documentation

- [FINAL_DEPLOYMENT_CHECKLIST.md](./FINAL_DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Local development setup
- [API_SETUP_COMPLETE.md](./API_SETUP_COMPLETE.md) - API documentation
- [DESIGN_ENHANCEMENT.md](./DESIGN_ENHANCEMENT.md) - Design system details
- [RESPONSIVE_COMPLETE.md](./RESPONSIVE_COMPLETE.md) - Responsive design guide
- [TEST_API.html](./TEST_API.html) - Interactive API tester

## 🔌 API Endpoints (13 Total)

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Influencers
- `POST /api/v1/instagram/fetch` - Fetch Instagram influencers
- `POST /api/v1/youtube/fetch` - Fetch YouTube influencers

### Saved Influencers
- `POST /api/v1/saved-influencers/bulk` - Save multiple influencers
- `GET /api/v1/saved-influencers` - Get saved influencers
- `DELETE /api/v1/saved-influencers/:influencerId` - Remove saved influencer

### Saved Searches
- `POST /api/v1/saved-searches` - Save a search
- `GET /api/v1/saved-searches` - Get saved searches

### Health
- `GET /health` - Health check
- `GET /` - API info

## 💻 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run create:user      # Create/reset test user
npm run db:push          # Push database schema
npm run db:studio        # Open Prisma Studio
```

## 📁 Project Structure

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

## ⚡ API Quotas

- **YouTube:** 10,000 units/day (free)
- **Instagram120:** 100 requests/month (free tier)

## 🎨 Design Features

- Premium dark theme with navy and gold color scheme
- Smooth animations and micro-interactions
- Glassmorphism effects
- Responsive grid layouts
- Card-based UI components
- Interactive modals and sidebars
- Custom scrollbar styling

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 💡 Support

For issues or questions:
- Check [FINAL_DEPLOYMENT_CHECKLIST.md](./FINAL_DEPLOYMENT_CHECKLIST.md) for deployment help
- Use [TEST_API.html](./TEST_API.html) to test API endpoints
- Review application logs in `logs/` directory
- Check API dashboards for quota status

---

**Built with ❤️ for food influencer discovery**

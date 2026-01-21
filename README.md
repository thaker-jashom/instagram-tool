# Food Influencer Discovery System (India)

Phase 1: Foundation (Backend API)

## Requirements

- Node.js 18+
- PostgreSQL
- Redis

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Update .env with your credentials
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/config`: Configuration (DB, Redis, Env)
- `src/api`: API Routes, Controllers, Middleware
- `src/models`: Sequelize Models
- `src/queues`: BullMQ Workers
- `src/utils`: Helper utilities (Logger, Errors)

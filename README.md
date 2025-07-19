# Library Backend

A Node.js/Express backend for the library management system.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

## Deployment

This backend is configured for Render deployment.

**Start Command:** `npm start`
**Build Command:** `npm install`

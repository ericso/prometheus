# Artemis Backend

This is the backend service for the Artemis application. It's built with Express.js and TypeScript, using PostgreSQL as the database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/artemis
JWT_SECRET=your_jwt_secret
```

3. Run database migrations:
```bash
npm run migrate
```

## Development

Start the development server:
```bash
npm run dev
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Build

Build for production:
```bash
npm run build
```

## API Documentation

The API endpoints will be documented here. 
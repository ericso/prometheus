# Artemis

A Node.js application with Express and TypeScript, featuring JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# Authentication
JWT_SECRET=your_secure_secret_key  # Required in production, defaults to 'just-for-dev' in development
```

Note: For production environments, always set a secure JWT_SECRET. The default development value should not be used in production.

3. Database Setup:
```bash
# Run migrations
npm run migrate

# Rollback migrations if needed
npm run migrate:down
```

⚠️ **Warning**: Down migrations will DROP tables and delete all data. Use with caution, especially in production environments.

4. Development:
```bash
npm run dev
```

5. Testing:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

6. Build for production:
```bash
npm run build
npm start
```

## Features

- Express.js with TypeScript
- JWT Authentication
- PostgreSQL Database
- Database Migrations
- Development hot-reload
- Jest Testing Suite

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run migrate` - Run database migrations
- `npm run migrate:down` - Rollback database migrations (⚠️ drops tables)

## Database Migrations

The application uses a simple migration system located in `src/db/migrate.ts`. Migrations are executed in order and can be rolled back if needed.

Current migrations:
1. Create users table (`001_create_users_table`)

To create new migrations, add them to the `src/db/migrations` directory and update the `migrate.ts` file accordingly.

### Migration Safety

- **Up migrations** create or modify database structures in a non-destructive way
- **Down migrations** (rollbacks) will DROP affected tables and DELETE ALL DATA
- Always backup your database before running migrations in production
- Test migrations in a development environment first 
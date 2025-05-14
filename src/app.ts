import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import authRoutes from './routes/auth.routes';
import { verifyToken, AuthRequest } from './middleware/auth.middleware';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Protected route example
app.get('/protected', [verifyToken as RequestHandler], ((req: AuthRequest, res: Response): void => {
  res.status(200).json({ 
    message: "Protected route accessed successfully",
    user: (req as AuthRequest).user
  });
}) as RequestHandler);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express + TypeScript Server' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 
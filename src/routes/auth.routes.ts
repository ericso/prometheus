import { Router, Request, Response, RequestHandler } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', ((req: Request, res: Response) => {
  void register(req, res);
}) as RequestHandler);

router.post('/login', ((req: Request, res: Response) => {
  void login(req, res);
}) as RequestHandler);

export default router; 
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePassword, generateToken } from '@utils/auth.utils';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import { PostgresUserService } from '@services/postgres-user.service';

export class AuthController {
  constructor(private userService: UserService = new PostgresUserService()) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const newUser: User = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name
      };

      await this.userService.create(newUser);

      const token = generateToken(newUser);

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error registering user" });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error logging in" });
    }
  };
}
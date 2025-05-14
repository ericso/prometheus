import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';
import { User } from '../types/user';

// Keep users array private to the module
// TODO: Move to a database
const users: User[] = [];

// Add test utility function
export const __test_reset_users = () => {
  while (users.length) users.pop();
};

// register is a function that registers a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// login is a function that logs in a user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
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
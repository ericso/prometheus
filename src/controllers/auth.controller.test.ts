import { Request, Response } from 'express';
import { register, login, __test_reset_users } from './auth.controller';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';

// Mock the utils
jest.mock('../utils/auth.utils', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn()
}));

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    __test_reset_users();  // Reset users before each test
    
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    // Reset all mock implementations
    (hashPassword as jest.Mock).mockReset();
    (generateToken as jest.Mock).mockReset();
    (comparePassword as jest.Mock).mockReset();
  });

  describe('register', () => {
    const validRegistrationData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    beforeEach(() => {
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (generateToken as jest.Mock).mockReturnValue('mockToken');
    });

    it('should successfully register a new user', async () => {
      mockRequest.body = validRegistrationData;

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User registered successfully',
        token: 'mockToken',
        user: expect.objectContaining({
          email: validRegistrationData.email,
          name: validRegistrationData.name
        })
      }));
    });

    it('should return 400 if user already exists', async () => {
      // Register first user
      mockRequest.body = validRegistrationData;
      await register(mockRequest as Request, mockResponse as Response);

      // Try to register same user again
      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User already exists'
      }));
    });

    it('should return 500 if registration fails', async () => {
      mockRequest.body = validRegistrationData;
      (hashPassword as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Hash failed')));

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error registering user'
      });
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    beforeEach(async () => {
      // Reset mocks before registration
      jest.clearAllMocks();

      // Register a user first
      mockRequest.body = validLoginData;
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (generateToken as jest.Mock).mockReturnValue('mockToken');
      await register(mockRequest as Request, mockResponse as Response);

      // Clear mock calls but keep the registered user
      jest.clearAllMocks();
      
      // Reset response mock
      mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis()
      };
    });

    it('should successfully login an existing user', async () => {
      mockRequest.body = {
        email: validLoginData.email,
        password: validLoginData.password
      };
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('loginToken');

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
        token: 'loginToken',
        user: expect.objectContaining({
          email: validLoginData.email,
          name: validLoginData.name
        })
      }));
    });

    it('should return 401 for non-existent user', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid credentials'
      }));
    });

    it('should return 401 for invalid password', async () => {
      mockRequest.body = {
        email: validLoginData.email,
        password: 'wrongpassword'
      };
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should return 500 if login fails', async () => {
      // Setup login request
      mockRequest.body = {
        email: validLoginData.email,
        password: validLoginData.password
      };

      // Setup mocks for failed login
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error logging in'
      });
    });
  });
}); 
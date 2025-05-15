import { InMemoryUserService } from './in-memory-user.service';
import { User } from '../types/user';

describe('InMemoryUserService', () => {
  let userService: InMemoryUserService;
  
  beforeEach(() => {
    userService = new InMemoryUserService();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  };

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createdUser = await userService.create(mockUser);
      
      expect(createdUser).toEqual(mockUser);
    });

    it('should store the created user', async () => {
      await userService.create(mockUser);
      
      const foundUser = await userService.findByEmail(mockUser.email);
      expect(foundUser).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return undefined for non-existent user', async () => {
      const user = await userService.findByEmail('nonexistent@example.com');
      
      expect(user).toBeUndefined();
    });

    it('should find existing user by email', async () => {
      await userService.create(mockUser);
      
      const foundUser = await userService.findByEmail(mockUser.email);
      expect(foundUser).toEqual(mockUser);
    });

    it('should not find user with different email', async () => {
      await userService.create(mockUser);
      
      const foundUser = await userService.findByEmail('different@example.com');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('__test_reset', () => {
    it('should clear all stored users', async () => {
      await userService.create(mockUser);
      userService.__test_reset();
      
      const foundUser = await userService.findByEmail(mockUser.email);
      expect(foundUser).toBeUndefined();
    });
  });
}); 
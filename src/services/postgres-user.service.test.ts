import { Pool, QueryResult } from 'pg';
import { PostgresUserService } from '@services/postgres-user.service';
import { User } from '@models/user';

describe('PostgresUserService', () => {
  let mockPool: { 
    query: jest.Mock<Promise<QueryResult<User>>>;
    end: jest.Mock;
  };
  let userService: PostgresUserService;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
      end: jest.fn(),
    };

    userService = new PostgresUserService(mockPool as unknown as Pool);
  });

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  };

  describe('create', () => {
    it('should create a user in the database', async () => {
      mockPool.query.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
        command: '',
        fields: [],
        oid: 0,
      } as QueryResult<User>);

      const result = await userService.create(mockUser);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [mockUser.id, mockUser.email, mockUser.password, mockUser.name]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find existing user by email', async () => {
      mockPool.query.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
        command: '',
        fields: [],
        oid: 0,
      } as QueryResult<User>);

      const result = await userService.findByEmail(mockUser.email);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users'),
        [mockUser.email]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return undefined for non-existent user', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 0,
        command: '',
        fields: [],
        oid: 0,
      } as QueryResult<User>);

      const result = await userService.findByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });
  });
}); 
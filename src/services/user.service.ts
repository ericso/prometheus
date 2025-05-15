import { User } from '../types/user';

export interface UserService {
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
}


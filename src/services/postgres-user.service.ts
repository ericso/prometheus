import { Pool } from 'pg';
import { User } from '../types/user';
import { UserService } from './user.service';
import { pool } from '../config/database';

export class PostgresUserService implements UserService {
  constructor(private db: Pool = pool) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return undefined;
    }

    return {
      id: result.rows[0].id,
      email: result.rows[0].email,
      password: result.rows[0].password,
      name: result.rows[0].name
    };
  }

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, email, password, name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [user.id, user.email, user.password, user.name];
    const result = await this.db.query(query, values);

    return {
      id: result.rows[0].id,
      email: result.rows[0].email,
      password: result.rows[0].password,
      name: result.rows[0].name
    };
  }
} 
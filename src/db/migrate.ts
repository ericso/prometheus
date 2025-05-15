import { pool } from '../config/database';
import * as createUsersTable from './migrations/001_create_users_table';

async function migrate() {
  try {
    await createUsersTable.up();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate(); 
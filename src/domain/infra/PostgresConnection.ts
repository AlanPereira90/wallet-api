import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import { ENV, POSTGRES } from '../utils/environment';

export const connection = new DataSource({
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  username: POSTGRES.USER_NAME,
  password: POSTGRES.PASSWORD,
  database: POSTGRES.DATABASE,
  migrations: ['../../migrations/*.ts'],
  entities: ['../entities/*.ts'],
});

export async function connectDB() {
  const db = await connection.initialize();

  console.info('PostgreSQL connection stablished');

  if (ENV !== 'test') {
    container.registerInstance('PostgresConnection', db);
  }
}

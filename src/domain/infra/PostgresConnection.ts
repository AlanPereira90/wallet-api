import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import { ENV, POSTGRES } from '../utils/environment';
import WalletEntity from '../wallet/entities/WalletEntity';

export const connection = new DataSource({
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  username: POSTGRES.USER_NAME,
  password: POSTGRES.PASSWORD,
  database: POSTGRES.DATABASE,
  migrations: ['migrations/**/*.ts'],
  entities: ['src/domain/wallet/entities/**/*.ts'],
});

export async function connectDB() {
  const db = await connection.initialize();

  try {
    await db.getRepository(WalletEntity).find();
  } catch (error: any) {
    console.log('------>', error.message);
  }

  console.info('PostgreSQL connection stablished');

  if (ENV !== 'test') {
    container.registerInstance('PostgresConnection', db);
  }
}

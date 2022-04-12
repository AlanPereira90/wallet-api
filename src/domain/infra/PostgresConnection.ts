import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import { POSTGRES } from '../utils/environment';

export const connection = new DataSource({
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  username: POSTGRES.USER_NAME,
  password: POSTGRES.PASSWORD,
  database: POSTGRES.DATABASE,
  migrations: ['../../migrations/*.ts'],
});

container.registerInstance('PostgresConnection', async () => await connection.initialize());

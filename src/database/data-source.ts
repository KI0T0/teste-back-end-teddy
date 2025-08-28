import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'test',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

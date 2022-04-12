import 'reflect-metadata';

import './domain/config/di';
import './application/config/di';

import { connectDB } from './domain/infra/PostgresConnection';

connectDB().then(() => {
  const { App } = require('./application/setup/App');

  const app = new App();
  app.listen();
});

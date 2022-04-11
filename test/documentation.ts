import { OpenAPIDocument } from 'easy-api-doc';

import { version } from '../package.json';

export const doc = new OpenAPIDocument(
  './doc/api-reference.yml',
  {
    version,
    title: 'Wallet API',
    description: 'Wallet API definitions',
  },
  [{ url: 'http://localhost:6060', description: 'Wallet API Server' }],
);

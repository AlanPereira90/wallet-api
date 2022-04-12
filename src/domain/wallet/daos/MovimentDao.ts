import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import Moviment from '../entities/Moviment';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'WalletDao',
    useFactory: async () => {
      const connection = await container.resolve<DataSource>('PostgresConnection');
      return connection.getRepository(Moviment);
    },
  },
])
export default class MovimentDao {}

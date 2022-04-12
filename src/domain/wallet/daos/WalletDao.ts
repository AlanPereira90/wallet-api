import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import Wallet from '../entities/Wallet';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'WalletDao',
    useFactory: async () => {
      const connection = await container.resolve<DataSource>('PostgresConnection');
      return connection.getRepository(Wallet);
    },
  },
])
export default class WalletDao {}

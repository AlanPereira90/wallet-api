import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import WalletEntity from '../entities/WalletEntity';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'WalletDao',
    useFactory: async () => {
      const connection = await container.resolve<DataSource>('PostgresConnection');
      return connection.getRepository<WalletEntity>(WalletEntity);
    },
  },
])
export default class WalletDao {}

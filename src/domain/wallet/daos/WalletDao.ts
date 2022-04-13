import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import WalletEntity from '../entities/WalletEntity';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'WalletDao',
    useFactory: () => container.resolve<DataSource>('PostgresConnection').getRepository(WalletEntity),
  },
])
export default class WalletDao {}

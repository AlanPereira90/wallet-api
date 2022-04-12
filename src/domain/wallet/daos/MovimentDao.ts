import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import Moviment from '../entities/MovimentEntity';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'MovimentDao',
    useFactory: async () => {
      const connection = await container.resolve<DataSource>('PostgresConnection');
      return connection.getRepository(Moviment);
    },
  },
])
export default class MovimentDao {}

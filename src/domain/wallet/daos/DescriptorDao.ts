import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';

import Descriptor from '../entities/DescriptorEntity';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'DescriptorDao',
    useFactory: async () => {
      const connection = await container.resolve<DataSource>('PostgresConnection');
      return connection.getRepository(Descriptor);
    },
  },
])
export default class DescriptorDao {}

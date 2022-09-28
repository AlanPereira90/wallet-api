import { container, Lifecycle, registry, scoped } from 'tsyringe';
import { DataSource } from 'typeorm';
import DescriptorEntity from '../entities/DescriptorEntity';

@scoped(Lifecycle.ResolutionScoped)
@registry([
  {
    token: 'DescriptorDao',
    useFactory: () => container.resolve<DataSource>('PostgresConnection').getRepository(DescriptorEntity),
  },
])
export default class DescriptorDao {}

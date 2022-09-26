import { DescriptorData, DescriptorWithId } from '../../entities/interfaces/IDescriptor';

export interface IDescriptorRepository {
  create(descriptor: DescriptorData): Promise<DescriptorWithId>;
}

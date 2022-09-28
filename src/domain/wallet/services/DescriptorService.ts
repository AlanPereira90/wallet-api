import { IDescriptorService } from './interfaces/IDescriptorService';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { IDescriptorRepository } from '../repositories/interfaces/IDescriptorRepository';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'DescriptorService', useClass: DescriptorService }])
export default class DescriptorService implements IDescriptorService {
  constructor(@inject('DescriptorRepository') private readonly _repository: IDescriptorRepository) {}

  async create(walletId: number, name: string, description?: string): Promise<number> {
    const createdDescriptor = await this._repository.create({ walletId, name, description, enabled: true });

    return createdDescriptor.id;
  }
}

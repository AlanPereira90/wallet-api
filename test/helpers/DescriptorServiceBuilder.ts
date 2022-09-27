import { stub } from 'sinon';
import { IDescriptorRepository } from '../../src/domain/wallet/repositories/interfaces/IDescriptorRepository';
import { IDescriptorService } from '../../src/domain/wallet/services/interfaces/IDescriptorService';
import DescriptorService from '../../src/domain/wallet/services/DescriptorService';

export default class DescriptorServiceBuilder {
  public static build(repository: Partial<IDescriptorRepository> = {}): IDescriptorService {
    const create = stub();

    return new DescriptorService({ create, ...repository });
  }
}

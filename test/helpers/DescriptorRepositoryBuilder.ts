import { stub } from 'sinon';
import DescriptorRepository from '../../src/domain/wallet/repositories/DescriptorRepository';
import { IDescriptorDao } from '../../src/domain/wallet/daos/interfaces/IDescriptorDao';
import { IDescriptorRepository } from '../../src/domain/wallet/repositories/interfaces/IDescriptorRepository';

export default class DescriptorRepositoryBuilder {
  public static build(dao: Partial<IDescriptorDao> = {}): IDescriptorRepository {
    const save = stub();
    const update = stub();
    const findOne = stub();
    const findBy = stub();
    const del = stub();

    return new DescriptorRepository({ save, update, findOne, findBy, delete: del, ...dao });
  }
}

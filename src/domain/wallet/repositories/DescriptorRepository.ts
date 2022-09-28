import { IDescriptorRepository } from './interfaces/IDescriptorRepository';
import { DescriptorData, DescriptorWithId } from '../entities/interfaces/IDescriptor';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { IDescriptorDao } from '../daos/interfaces/IDescriptorDao';
import ResponseError from '../../common/utils/ResponseError';
import { INTERNAL_SERVER_ERROR } from 'http-status';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'DescriptorRepository', useClass: DescriptorRepository }])
export default class DescriptorRepository implements IDescriptorRepository {
  constructor(@inject('DescriptorDao') private readonly _dao: IDescriptorDao) {}

  async create(descriptor: DescriptorData): Promise<DescriptorWithId> {
    try {
      console.log('--->', descriptor);
      const result = await this._dao.save(descriptor);
      return result;
    } catch (error: any) {
      console.error(`[ERROR]: ${error.message}`);

      throw new ResponseError(INTERNAL_SERVER_ERROR, error.message);
    }
  }
}

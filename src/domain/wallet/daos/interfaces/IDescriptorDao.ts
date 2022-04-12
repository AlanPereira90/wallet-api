import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import DescriptorEntity from '../../entities/DescriptorEntity';

export interface IDescriptorDao {
  create(wallet: DeepPartial<DescriptorEntity>): DescriptorEntity;
  update(criteria: FindOptionsWhere<DescriptorEntity>, fields: Partial<DescriptorEntity>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<DescriptorEntity>): Promise<DescriptorEntity | null>;
  find(options: FindManyOptions<DescriptorEntity>): Promise<DescriptorEntity[]>;
  delete(criteria: FindOptionsWhere<DescriptorEntity>): Promise<DeleteResult>;
}

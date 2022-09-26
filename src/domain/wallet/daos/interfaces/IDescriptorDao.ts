import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import DescriptorEntity from '../../entities/DescriptorEntity';

export interface IDescriptorDao {
  save(wallet: DeepPartial<DescriptorEntity>): DescriptorEntity;
  update(criteria: FindOptionsWhere<DescriptorEntity>, fields: Partial<DescriptorEntity>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<DescriptorEntity>): Promise<DescriptorEntity | null>;
  findBy(where: FindOptionsWhere<DescriptorEntity>): Promise<DescriptorEntity[]>;
  delete(where: FindOptionsWhere<DescriptorEntity>): Promise<DeleteResult>;
}

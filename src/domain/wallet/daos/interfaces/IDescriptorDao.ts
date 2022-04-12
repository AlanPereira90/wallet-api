import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import Descriptor from '../../entities/Descriptor';

export interface IDescriptorDao {
  create(wallet: DeepPartial<Descriptor>): Descriptor;
  update(criteria: FindOptionsWhere<Descriptor>, fields: Partial<Descriptor>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<Descriptor>): Promise<Descriptor | null>;
  find(options: FindManyOptions<Descriptor>): Promise<Descriptor[]>;
  delete(criteria: FindOptionsWhere<Descriptor>): Promise<DeleteResult>;
}

import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import MovimentEntity from '../../entities/MovimentEntity';

export interface IMovimentDao {
  create(wallet: DeepPartial<MovimentEntity>): MovimentEntity;
  update(criteria: FindOptionsWhere<MovimentEntity>, fields: Partial<MovimentEntity>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<MovimentEntity>): Promise<MovimentEntity | null>;
  find(options: FindManyOptions<MovimentEntity>): Promise<MovimentEntity[]>;
  delete(criteria: FindOptionsWhere<MovimentEntity>): Promise<DeleteResult>;
}

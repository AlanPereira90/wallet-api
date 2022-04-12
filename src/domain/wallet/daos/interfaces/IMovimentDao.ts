import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import Moviment from '../../entities/Moviment';

export interface IMovimentDao {
  create(wallet: DeepPartial<Moviment>): Moviment;
  update(criteria: FindOptionsWhere<Moviment>, fields: Partial<Moviment>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<Moviment>): Promise<Moviment | null>;
  find(options: FindManyOptions<Moviment>): Promise<Moviment[]>;
  delete(criteria: FindOptionsWhere<Moviment>): Promise<DeleteResult>;
}

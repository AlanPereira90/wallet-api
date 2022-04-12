import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import Wallet from '../../entities/Wallet';

export interface IWalletDao {
  create(wallet: DeepPartial<Wallet>): Wallet;
  update(criteria: FindOptionsWhere<Wallet>, fields: Partial<Wallet>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<Wallet>): Promise<Wallet | null>;
  find(options: FindManyOptions<Wallet>): Promise<Wallet[]>;
  delete(criteria: FindOptionsWhere<Wallet>): Promise<DeleteResult>;
}

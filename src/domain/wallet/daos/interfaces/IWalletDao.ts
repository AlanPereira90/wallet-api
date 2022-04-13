import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import WalletEntity from '../../entities/WalletEntity';

export interface IWalletDao {
  save(wallet: DeepPartial<WalletEntity>): Promise<WalletEntity>;
  update(criteria: FindOptionsWhere<WalletEntity>, fields: Partial<WalletEntity>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<WalletEntity>): Promise<WalletEntity | null>;
  find(options?: FindManyOptions<WalletEntity>): Promise<WalletEntity[]>;
  delete(criteria: FindOptionsWhere<WalletEntity>): Promise<DeleteResult>;
}

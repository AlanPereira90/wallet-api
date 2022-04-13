import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';

import WalletEntity from '../../entities/WalletEntity';

export interface IWalletDao {
  save(wallet: DeepPartial<WalletEntity>): Promise<WalletEntity>;
  update(criteria: FindOptionsWhere<WalletEntity>, fields: Partial<WalletEntity>): Promise<UpdateResult>;
  findOne(options: FindOneOptions<WalletEntity>): Promise<WalletEntity | null>;
  findBy(where: FindOptionsWhere<WalletEntity>): Promise<WalletEntity[]>;
  delete(where: FindOptionsWhere<WalletEntity>): Promise<DeleteResult>;
}

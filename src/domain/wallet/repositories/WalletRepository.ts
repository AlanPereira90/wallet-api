import { INTERNAL_SERVER_ERROR } from 'http-status';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';

import ResponseError from '../../common/utils/ResponseError';
import { IWalletDao } from '../daos/interfaces/IWalletDao';
import { WalletData, WalletWithId } from '../entities/interfaces/IWallet';
import { IWalletRepository } from './interfaces/IWalletRepository';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'WalletRepository', useClass: WalletRepository }])
export default class WalletRepository implements IWalletRepository {
  constructor(@inject('WalletDao') private readonly _dao: IWalletDao) {}

  async create(wallet: WalletData): Promise<WalletWithId> {
    try {
      const result = await this._dao.save(wallet);
      return result;
    } catch (error: any) {
      console.error(`[ERROR]: ${error.message}`);

      throw new ResponseError(INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async retrieveBy(filter?: Partial<WalletData>): Promise<WalletWithId[]> {
    try {
      const result = await this._dao.findBy({ ...filter });
      return result;
    } catch (error: any) {
      console.error(`[ERROR]: ${error.message}`);

      throw new ResponseError(INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async updateBy(filter: Partial<WalletData>, data: Partial<WalletData>): Promise<WalletWithId> {
    const result = await this._dao.update(filter, data);
    return result.raw;
  }
}

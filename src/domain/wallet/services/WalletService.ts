import { NOT_FOUND } from 'http-status';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { WalletWithId } from '../entities/interfaces/IWallet';

import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';
import { IWalletService } from './interfaces/IWalletService';
import { WALLET_ERRORS } from '../../common/utils/error';
import ResponseError from '../../common/utils/ResponseError';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'WalletService', useClass: WalletService }])
export default class WalletService implements IWalletService {
  constructor(@inject('WalletRepository') private readonly _repository: IWalletRepository) {}

  async create(name: string, credentialId: string): Promise<number> {
    const createdWallet = await this._repository.create({ name, credentialId, enabled: true });

    return createdWallet.id;
  }

  async findByCredential(credentialId: string): Promise<WalletWithId[]> {
    const wallets = await this._repository.retrieveBy({ credentialId });

    if (!wallets.length) {
      throw new ResponseError(NOT_FOUND, WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE, WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
    }
    return wallets;
  }

  async findByNameAndCredential(name: string, credentialId: string): Promise<WalletWithId> {
    const wallet = await this._repository.retrieveBy({ name, credentialId });

    if (!wallet.length) {
      throw new ResponseError(NOT_FOUND, WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE, WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
    }
    return wallet[0];
  }
}

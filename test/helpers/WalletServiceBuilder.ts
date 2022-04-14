import { stub } from 'sinon';

import WalletService from '../../src/domain/wallet/services/WalletService';
import { IWalletRepository } from '../../src/domain/wallet/repositories/interfaces/IWalletRepository';
import { IWalletService } from '../../src/domain/wallet/services/interfaces/IWalletService';

export default class WalletServiceBuilder {
  public static build(repository: Partial<IWalletRepository> = {}): IWalletService {
    const create = stub();
    const retrieveBy = stub();
    const updateBy = stub();

    return new WalletService({ create, retrieveBy, updateBy, ...repository });
  }
}

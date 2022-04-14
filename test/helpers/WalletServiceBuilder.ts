import { stub } from 'sinon';

import WalletService from '../../src/domain/wallet/services/WalletService';
import { IWalletRepository } from '../../src/domain/wallet/repositories/interfaces/IWalletRepository';
import { IWalletService } from '../../src/domain/wallet/services/interfaces/IWalletService';

export default class WalletServiceBuilder {
  public static build(repository: Partial<IWalletRepository> = {}): IWalletService {
    const create = stub();
    const retrieveBy = stub();

    return new WalletService({ create, retrieveBy, ...repository });
  }
}

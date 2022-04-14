import { stub } from 'sinon';

import { IWalletRepository } from '../../src/domain/wallet/repositories/interfaces/IWalletRepository';
import WalletRepository from '../../src/domain/wallet/repositories/WalletRepository';
import { IWalletDao } from '../../src/domain/wallet/daos/interfaces/IWalletDao';

export default class WalletRepositoryBuilder {
  public static build(dao: Partial<IWalletDao> = {}): IWalletRepository {
    const save = stub();
    const update = stub();
    const findOne = stub();
    const findBy = stub();
    const del = stub();

    return new WalletRepository({ save, update, findOne, findBy, delete: del, ...dao });
  }
}

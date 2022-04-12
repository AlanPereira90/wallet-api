import { inject, Lifecycle, registry, scoped } from 'tsyringe';

import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';
import { IWalletService } from './interfaces/IWalletService';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'WalletService', useClass: WalletService }])
export default class WalletService implements IWalletService {
  constructor(@inject('WalletRepository') private readonly _repository: IWalletRepository) {}

  async create(name: string, credentialId: string): Promise<number> {
    const createdWallet = await this._repository.create({ name, credentialId, enabled: true });

    return createdWallet.id;
  }
}

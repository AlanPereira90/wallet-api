import { WalletData, WalletWithId } from '../../entities/interfaces/IWallet';

export interface IWalletRepository {
  create(wallet: WalletData): Promise<WalletWithId>;
}

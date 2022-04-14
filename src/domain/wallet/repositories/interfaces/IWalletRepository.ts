import { WalletData, WalletWithId } from '../../entities/interfaces/IWallet';

export interface IWalletRepository {
  create(wallet: WalletData): Promise<WalletWithId>;
  retrieveBy(filter?: Partial<WalletWithId>): Promise<WalletWithId[]>;
  updateBy(filter: Partial<WalletWithId>, data: Partial<WalletData>): Promise<WalletWithId>;
}

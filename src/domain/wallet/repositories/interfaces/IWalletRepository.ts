import { WalletData, WalletWithId } from '../../entities/interfaces/IWallet';

export interface IWalletRepository {
  create(wallet: WalletData): Promise<WalletWithId>;
  retrieveBy(filter?: Partial<WalletData>): Promise<WalletWithId[]>;
  updateBy(filter: Partial<WalletData>, data: Partial<WalletData>): Promise<WalletWithId>;
}

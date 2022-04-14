import { WalletData, WalletWithId } from '../../entities/interfaces/IWallet';

export interface IWalletService {
  create(name: string, credentialId: string): Promise<number>;
  findByCredential(credentialId: string): Promise<WalletWithId[]>;
  findByNameAndCredential(name: string, credentialId: string): Promise<WalletWithId>;
  update(id: number, credentialId: string, fields: Partial<WalletData>): Promise<WalletWithId>;
}

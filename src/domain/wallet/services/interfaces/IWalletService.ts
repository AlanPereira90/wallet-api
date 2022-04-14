import { WalletPublicInfo } from '../../entities/interfaces/IWallet';

export interface IWalletService {
  create(name: string, credentialId: string): Promise<number>;
  findByCredential(credentialId: string): Promise<WalletPublicInfo[]>;
  findByNameAndCredential(name: string, credentialId: string): Promise<WalletPublicInfo>;
}

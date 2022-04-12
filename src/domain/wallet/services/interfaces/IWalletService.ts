export interface IWalletService {
  create(name: string, credentialId: string): Promise<number>;
}

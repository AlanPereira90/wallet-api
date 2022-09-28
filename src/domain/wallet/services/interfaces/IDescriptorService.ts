export interface IDescriptorService {
  create(walletId: number, name: string, description?: string): Promise<number>;
}

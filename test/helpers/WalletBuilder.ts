import faker from '@faker-js/faker';
import { WalletData } from '../../src/domain/wallet/entities/interfaces/IWallet';

export default class WalletBuilder {
  public static build(fields: Partial<WalletData> = {}): WalletData {
    return {
      name: faker.name.firstName(),
      enabled: true,
      credentialId: faker.datatype.uuid(),
      ...fields,
    };
  }
}

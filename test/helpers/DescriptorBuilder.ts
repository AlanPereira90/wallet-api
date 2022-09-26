import { DescriptorData } from '../../src/domain/wallet/entities/interfaces/IDescriptor';
import faker from '@faker-js/faker';

export default class DescriptorBuilder {
  public static build(fields: Partial<DescriptorData> = {}): DescriptorData {
    return {
      name: faker.lorem.word(),
      enabled: true,
      description: faker.lorem.sentence(),
      walletId: faker.datatype.number(),
      ...fields,
    };
  }
}

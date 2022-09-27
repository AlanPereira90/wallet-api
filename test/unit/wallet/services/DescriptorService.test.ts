import faker from '@faker-js/faker';
import DescriptorServiceBuilder from '../../../helpers/DescriptorServiceBuilder';
import { stub } from 'sinon';
import DescriptorBuilder from '../../../helpers/DescriptorBuilder';
import { expect } from 'chai';

describe('Descriptor service', () => {
  describe('create()', () => {
    it('should create a descriptor successfully', async () => {
      const descriptor = DescriptorBuilder.build();
      const id = faker.datatype.number();

      const create = stub().resolves({ id, ...descriptor });
      const instance = DescriptorServiceBuilder.build({ create });

      const result = await instance.create(descriptor.walletId, descriptor.name, descriptor.description!);

      expect(result).to.be.equal(id);
      expect(create).to.be.calledOnceWith(descriptor);
    });
  });
});

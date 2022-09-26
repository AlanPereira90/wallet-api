import DescriptorBuilder from '../../../helpers/DescriptorBuilder';
import faker from '@faker-js/faker';
import { stub } from 'sinon';
import DescriptorRepositoryBuilder from '../../../helpers/DescriptorRepositoryBuilder';
import { expect } from 'chai';

describe('Descriptor Repository', () => {
  describe('create()', () => {
    it('should create a descriptor successfully', async () => {
      const descriptor = DescriptorBuilder.build();
      const id = faker.datatype.number();

      const save = stub().resolves({ id, ...descriptor });
      const instance = DescriptorRepositoryBuilder.build({ save });

      const result = await instance.create(descriptor);

      expect(result).to.be.deep.equal({ id, ...descriptor });
      expect(save).to.be.calledOnceWith(descriptor);
    });

    it('should fail when dao fails', async () => {
      const descriptor = DescriptorBuilder.build();
      const message = faker.lorem.sentence();

      const save = stub().rejects(new Error(message));
      const instance = DescriptorRepositoryBuilder.build({ save });

      const promise = instance.create(descriptor);

      await expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(save).to.be.calledOnceWith(descriptor);
    });
  });
});

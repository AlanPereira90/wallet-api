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

  describe('retrieveBy()', () => {
    it('should retrieve an array of descriptors successfully given a valid filter', async () => {
      const filter = {
        name: faker.lorem.word(),
        walletId: faker.datatype.number(),
      };
      const descriptors = [DescriptorBuilder.build({ ...filter }), DescriptorBuilder.build({ ...filter })];

      const findBy = stub().resolves(descriptors);
      const instance = DescriptorRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy(filter);

      expect(result).to.be.deep.equal(descriptors);
      expect(findBy).to.be.calledOnceWith(filter);
    });

    it('should retrieve an array of descriptors successfully given an empty filter', async () => {
      const descriptors = [DescriptorBuilder.build(), DescriptorBuilder.build()];

      const findBy = stub().resolves(descriptors);
      const instance = DescriptorRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy({});

      expect(result).to.be.deep.equal(descriptors);
      expect(findBy).to.be.calledOnceWith({});
    });

    it('should return an empty array when search does reach out nothing', async () => {
      const filter = {
        name: faker.lorem.word(),
        walletId: faker.datatype.number(),
      };

      const findBy = stub().resolves([]);
      const instance = DescriptorRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy(filter);

      expect(result).to.be.deep.equal([]);
      expect(findBy).to.be.calledOnceWith(filter);
    });

    it('should fail when dao fails', async () => {
      const filter = {
        name: faker.lorem.word(),
        walletId: faker.datatype.number(),
      };
      const message = faker.lorem.word();

      const findBy = stub().rejects(new Error(message));
      const instance = DescriptorRepositoryBuilder.build({ findBy });

      const promise = instance.retrieveBy(filter);

      await expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(findBy).to.be.calledOnceWith(filter);
    });
  });
});

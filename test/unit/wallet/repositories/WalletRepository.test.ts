import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import WalletRepositoryBuilder from '../../helpers/WalletRepositoryBuilder';
import WalletBuilder from '../../helpers/WalletBuilder';

describe('Wallet Repository', () => {
  describe('create()', () => {
    it('should create a wallet successfully', async () => {
      const wallet = WalletBuilder.build();
      const id = faker.datatype.number();

      const save = stub().resolves({ id, ...wallet });
      const instance = WalletRepositoryBuilder.build({ save });

      const result = await instance.create(wallet);

      expect(result).to.be.deep.equal({ id, ...wallet });
      expect(save).to.be.calledOnceWith(wallet);
    });

    it('should fail when dao fails', async () => {
      const wallet = WalletBuilder.build();
      const message = faker.lorem.sentence();

      const save = stub().rejects(new Error(message));
      const instance = WalletRepositoryBuilder.build({ save });

      const promise = instance.create(wallet);

      await expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(save).to.be.calledOnceWith(wallet);
    });
  });

  describe('retrieveBy()', () => {
    it('should find wallets given a filter successfully', async () => {
      const filter = {
        name: faker.name.firstName(),
      };
      const wallets = [WalletBuilder.build({ ...filter }), WalletBuilder.build({ ...filter })];

      const findBy = stub().resolves(wallets);
      const instance = WalletRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy(filter);

      expect(result).to.be.deep.equal(wallets);
      expect(findBy).to.be.calledOnceWith(filter);
    });

    it('should fail when dao fails', async () => {
      const filter = {
        name: faker.name.firstName(),
      };
      const message = faker.lorem.sentence();

      const findBy = stub().rejects(new Error(message));
      const instance = WalletRepositoryBuilder.build({ findBy });

      const promise = instance.retrieveBy(filter);

      expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(findBy).to.be.calledOnceWith(filter);
    });
  });
});

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

      const create = stub().resolves({ id, ...wallet });
      const instance = WalletRepositoryBuilder.build({ create });

      const result = await instance.create(wallet);

      expect(result).to.be.deep.equal({ id, ...wallet });
      expect(create).to.be.calledOnceWith(wallet);
    });

    it('should fail when dao fails', async () => {
      const wallet = WalletBuilder.build();
      const message = faker.lorem.sentence();

      const create = stub().rejects(new Error(message));
      const instance = WalletRepositoryBuilder.build({ create });

      const promise = instance.create(wallet);

      await expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(create).to.be.calledOnceWith(wallet);
    });
  });
});

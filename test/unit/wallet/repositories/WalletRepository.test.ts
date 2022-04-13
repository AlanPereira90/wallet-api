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
});

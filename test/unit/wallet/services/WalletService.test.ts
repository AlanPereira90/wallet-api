import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import WalletBuilder from '../../helpers/WalletBuilder';
import WalletServiceBuilder from '../../helpers/WalletServiceBuilder';

describe('Wallet Service', () => {
  describe('create()', () => {
    it('should create a wallet successfully', async () => {
      const wallet = WalletBuilder.build();
      const id = faker.datatype.number();

      const create = stub().resolves({ id, ...wallet });

      const instance = WalletServiceBuilder.build({ create });

      const result = await instance.create(wallet.name, wallet.credentialId);

      expect(result).to.be.deep.equal(id);
      expect(create).to.be.calledOnceWith(wallet);
    });
  });
});

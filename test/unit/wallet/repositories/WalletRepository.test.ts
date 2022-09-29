import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import WalletRepositoryBuilder from '../../../helpers/WalletRepositoryBuilder';
import WalletBuilder from '../../../helpers/WalletBuilder';

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
    it('should find wallets given a filter successfully given a valid filter', async () => {
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

    it('should find wallets given a filter successfully given an empty filter', async () => {
      const wallets = [WalletBuilder.build(), WalletBuilder.build()];

      const findBy = stub().resolves(wallets);
      const instance = WalletRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy({});

      expect(result).to.be.deep.equal(wallets);
      expect(findBy).to.be.calledOnceWith({});
    });

    it('should return an empty array when search does reach out nothing', async () => {
      const filter = {
        name: faker.name.firstName(),
      };

      const findBy = stub().resolves([]);
      const instance = WalletRepositoryBuilder.build({ findBy });

      const result = await instance.retrieveBy(filter);

      expect(result).to.be.deep.equal([]);
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

  describe('updateBy()', () => {
    it('should update a wallet successfully', async () => {
      const filter = {
        name: faker.lorem.word(),
      };
      const newValues = {
        enabled: false,
      };
      const wallet = WalletBuilder.build({ ...filter });
      const updatedWallet = WalletBuilder.build({ ...wallet, ...newValues });

      const update = stub().resolves({ raw: updatedWallet });
      const instance = WalletRepositoryBuilder.build({ update });

      const result = await instance.updateBy(filter, newValues);

      expect(result).to.be.deep.equal(updatedWallet);
      expect(update).to.be.calledOnceWith(filter, newValues);
    });

    it('should fail when dao fails', async () => {
      const filter = {
        name: faker.lorem.word(),
      };
      const newValues = {
        enabled: false,
      };
      const message = faker.lorem.sentence();

      const update = stub().rejects(new Error(message));
      const instance = WalletRepositoryBuilder.build({ update });

      const promise = instance.updateBy(filter, newValues);

      expect(promise).to.be.eventually.rejected.with.property('message', message);
      expect(update).to.be.calledOnceWith(filter, newValues);
    });
  });
});

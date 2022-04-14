import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import WalletBuilder from '../../../helpers/WalletBuilder';
import WalletServiceBuilder from '../../../helpers/WalletServiceBuilder';
import { WALLET_ERRORS } from '../../../../src/domain/common/utils/error';

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

  describe('findByCredential()', () => {
    it('should find a wallet successfully given a credentialId', async () => {
      const credentialId = faker.datatype.uuid();
      const wallet = { id: faker.datatype.uuid(), ...WalletBuilder.build({ credentialId }) };

      const retrieveBy = stub().resolves([wallet]);

      const instance = WalletServiceBuilder.build({ retrieveBy });

      const result = await instance.findByCredential(credentialId);

      expect(result).to.be.deep.equal([wallet]);
      expect(retrieveBy).to.be.calledOnceWith({ credentialId });
    });

    it('should fail when wallet is not found', async () => {
      const credentialId = faker.datatype.uuid();

      const retrieveBy = stub().resolves([]);

      const instance = WalletServiceBuilder.build({ retrieveBy });

      const promise = instance.findByCredential(credentialId);

      await expect(promise).to.be.eventually.rejected.with.property('message', WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE);
      await expect(promise).to.be.eventually.rejected.with.property('code', WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
      expect(retrieveBy).to.be.calledOnceWith({ credentialId });
    });
  });

  describe('findByNameAndCredential()', () => {
    it('should find a wallet successfully given a name and credentialId', async () => {
      const credentialId = faker.datatype.uuid();
      const name = faker.lorem.word();

      const wallet = { id: faker.datatype.uuid(), ...WalletBuilder.build({ credentialId }) };

      const retrieveBy = stub().resolves([wallet]);

      const instance = WalletServiceBuilder.build({ retrieveBy });

      const result = await instance.findByNameAndCredential(name, credentialId);

      expect(result).to.be.deep.equal(wallet);
      expect(retrieveBy).to.be.calledOnceWith({ name, credentialId });
    });

    it('should fail when wallet is not found', async () => {
      const credentialId = faker.datatype.uuid();
      const name = faker.lorem.word();

      const retrieveBy = stub().resolves([]);

      const instance = WalletServiceBuilder.build({ retrieveBy });

      const promise = instance.findByNameAndCredential(name, credentialId);

      await expect(promise).to.be.eventually.rejected.with.property('message', WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE);
      await expect(promise).to.be.eventually.rejected.with.property('code', WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
      expect(retrieveBy).to.be.calledOnceWith({ name, credentialId });
    });
  });

  describe('update()', () => {
    it('should update a wallet successfully', async () => {
      const wallet = WalletBuilder.build();
      const id = faker.datatype.number();
      const fieldsToUpdate = { name: faker.lorem.word() };

      const retrieveBy = stub().resolves([wallet]);
      const updateBy = stub().resolves({ id, ...wallet, ...fieldsToUpdate });

      const instance = WalletServiceBuilder.build({ retrieveBy, updateBy });

      const result = await instance.update(id, wallet.credentialId, fieldsToUpdate);

      expect(result).to.be.deep.equal({ id, ...wallet, ...fieldsToUpdate });
      expect(retrieveBy).to.be.calledOnceWith({ id, credentialId: wallet.credentialId });
      expect(updateBy).to.be.calledOnceWith({ id }, fieldsToUpdate);
    });

    it('should fail when wallet is not found', async () => {
      const wallet = WalletBuilder.build();
      const id = faker.datatype.number();
      const fieldsToUpdate = { name: faker.lorem.word() };

      const retrieveBy = stub().resolves([]);
      const updateBy = stub().resolves({ id, ...wallet, ...fieldsToUpdate });

      const instance = WalletServiceBuilder.build({ retrieveBy, updateBy });

      const promise = instance.update(id, wallet.credentialId, fieldsToUpdate);

      await expect(promise).to.be.eventually.rejected.with.property('message', WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE);
      await expect(promise).to.be.eventually.rejected.with.property('code', WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
      expect(retrieveBy).to.be.calledOnceWith({ id, credentialId: wallet.credentialId });
    });
  });
});

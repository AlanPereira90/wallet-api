import { Express } from 'express';
import supertest from 'supertest';
import { expect } from 'chai';

import { App } from '../../../src/application/setup/App';
import { doc } from '../../documentation';
import { CREATED } from 'http-status';
import faker from '@faker-js/faker';
import { Repository } from 'typeorm';
import { stub } from 'sinon';
import { WalletWithId } from 'src/domain/wallet/entities/interfaces/IWallet';

let app: Express;
before(function () {
  app = new App().app;
});

after(async () => {
  try {
    await doc.writeFile();
  } catch (error) {
    console.error(error);
  }
});

describe('POST /wallets', () => {
  it.only('should return 201 created', async (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    const savedWallet: WalletWithId = {
      id: faker.datatype.number(),
      name: body.name,
      credentialId: headers['x-credential-id'],
      enabled: true,
    };

    const create = stub(Repository.prototype, 'create').resolves(savedWallet);

    supertest(app)
      .post('/wallets')
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(CREATED)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('accessToken').to.be.a('string');
        expect(create).to.be.calledOnceWith({ enabled: true, ...body });

        doc
          .path('/wallets')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });
});

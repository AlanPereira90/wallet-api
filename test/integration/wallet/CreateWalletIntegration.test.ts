import { Express } from 'express';
import supertest from 'supertest';
import { expect } from 'chai';
import faker from '@faker-js/faker';
import { Repository } from 'typeorm';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from 'http-status';
import { restore, stub } from 'sinon';

import { App } from '../../../src/application/setup/App';
import { WalletWithId } from '../../../src/domain/wallet/entities/interfaces/IWallet';
import { doc } from '../../documentation';
import { logger } from '../../../src/infra/logger/logger';

let app: Express;
before(function () {
  app = new App().app;
});

after(async () => {
  try {
    await doc.writeFile();
  } catch (error) {
    logger.error(error);
  }
});

afterEach(() => {
  restore();
});

describe('POST /wallets', () => {
  it('should return 201 CREATED', (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    const savedWallet: WalletWithId = {
      id: faker.datatype.number(),
      name: body.name,
      credentialId: headers['x-credential-id'],
      enabled: true,
    };

    const save = stub(Repository.prototype, 'save').resolves(savedWallet);

    supertest(app)
      .post('/wallets')
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(CREATED)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id').to.be.equal(savedWallet.id);
        expect(save).to.be.calledOnceWith({ enabled: true, name: body.name, credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid body', (done) => {
    const body = { namem: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    supertest(app)
      .post('/wallets')
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal('"name" is required');

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid body');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given a request without required headers', (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { [faker.lorem.word()]: faker.datatype.uuid() };

    supertest(app)
      .post('/wallets')
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal('Missing x-credential-id header');

        doc
          .path('/wallets')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid headers');

        done();
      });
  });

  it('should return 500 INTERNAL_SERVER_ERROR when database is down', (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const message = faker.lorem.sentence();
    const save = stub(Repository.prototype, 'save').rejects(new Error(message));

    supertest(app)
      .post('/wallets')
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal(message);
        expect(save).to.be.calledOnceWith({ enabled: true, name: body.name, credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'internal error');

        done();
      });
  });
});

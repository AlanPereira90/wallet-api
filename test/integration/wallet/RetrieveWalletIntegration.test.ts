import { Express } from 'express';
import supertest from 'supertest';
import { expect } from 'chai';
import faker from '@faker-js/faker';
import { Repository } from 'typeorm';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status';
import { restore, stub } from 'sinon';

import { App } from '../../../src/application/setup/App';
import { WALLET_ERRORS } from '../../../src/domain/common/utils/error';
import { doc } from '../../documentation';
import WalletBuilder from '../../helpers/WalletBuilder';
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

describe('GET /wallets', () => {
  it('should return 200 OK given a name and a credential', (done) => {
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const name = faker.lorem.word();

    const wallet = {
      id: faker.datatype.uuid(),
      ...WalletBuilder.build({ name, credentialId: headers['x-credential-id'] }),
    };

    const findBy = stub(Repository.prototype, 'findBy').resolves([wallet]);

    supertest(app)
      .get('/wallets')
      .set(headers)
      .query({ name })
      .expect(OK)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('wallets').to.be.deep.equal([wallet]);
        expect(findBy).to.be.calledOnceWith({ name, credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .addParameters({ in: 'query', name: 'name', example: name, allowEmptyValue: true })
          .verb('get', { tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'success with name and credential');

        done();
      });
  });

  it('should return 200 OK given just a credential', (done) => {
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const wallet = {
      id: faker.datatype.uuid(),
      ...WalletBuilder.build({ credentialId: headers['x-credential-id'] }),
    };

    const findBy = stub(Repository.prototype, 'findBy').resolves([wallet]);

    supertest(app)
      .get('/wallets')
      .set(headers)
      .expect(OK)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('wallets').to.be.deep.equal([wallet]);
        expect(findBy).to.be.calledOnceWith({ credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('get', { tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'success with credential');

        done();
      });
  });

  it('should return 404 NOT_FOUND when credential is not found', (done) => {
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const name = faker.lorem.word();

    const findBy = stub(Repository.prototype, 'findBy').resolves([]);

    supertest(app)
      .get('/wallets')
      .set(headers)
      .query({ name })
      .expect(NOT_FOUND)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.deep.equal(WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE);
        expect(res.body).to.have.property('code').to.be.deep.equal(WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
        expect(findBy).to.be.calledOnceWith({ name, credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .addParameters({ in: 'query', name: 'name', example: name, allowEmptyValue: true })
          .verb('get', { tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'not found');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid query', (done) => {
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const name = faker.lorem.word();

    supertest(app)
      .get('/wallets')
      .set(headers)
      .query({ namem: name })
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.deep.equal('"namem" is not allowed');

        doc
          .path('/wallets')
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .addParameters({ in: 'query', name: 'name', example: name, allowEmptyValue: true })
          .verb('get', { tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid query');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given a request without required headers', (done) => {
    const name = faker.lorem.word();

    supertest(app)
      .get('/wallets')
      .query({ name })
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.deep.equal('Missing x-credential-id header');

        doc
          .path('/wallets')
          .addParameters({ in: 'query', name: 'name', example: name, allowEmptyValue: true })
          .verb('get', { tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid headers');

        done();
      });
  });
});

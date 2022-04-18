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

afterEach(() => {
  restore();
});

describe('PUT /wallets', () => {
  it('should return 200 OK', (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const id = faker.datatype.number();
    const wallet = WalletBuilder.build({ name: body.name, credentialId: headers['x-credential-id'] });

    const findBy = stub(Repository.prototype, 'findBy').resolves([{ id, ...wallet }]);
    //@ts-ignore
    const update = stub(Repository.prototype, 'update').resolves({ raw: { id, ...wallet } });

    supertest(app)
      .put(`/wallets/${id}`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(OK)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.empty;
        expect(findBy).to.be.calledOnceWith({ id, credentialId: headers['x-credential-id'] });
        expect(update).to.be.calledOnceWith(
          { id },
          {
            ...body,
          },
        );

        doc
          .path('/wallets')
          .addParameters({
            in: 'path',
            name: 'id',
            example: id,
            allowEmptyValue: false,
          })
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('put', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });

  it('should return 404 NOT_FOUND when wallet is not found', (done) => {
    const body = { name: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const id = faker.datatype.number();

    const findBy = stub(Repository.prototype, 'findBy').resolves([]);

    supertest(app)
      .put(`/wallets/${id}`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(NOT_FOUND)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', WALLET_ERRORS.WALLET_NOT_FOUND.MESSAGE);
        expect(res.body).to.have.property('code', WALLET_ERRORS.WALLET_NOT_FOUND.CODE);
        expect(findBy).to.be.calledOnceWith({ id, credentialId: headers['x-credential-id'] });

        doc
          .path('/wallets')
          .addParameters({
            in: 'path',
            name: 'id',
            example: id,
            allowEmptyValue: false,
          })
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('put', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'wallet not found');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid body', (done) => {
    const body = { namem: faker.name.firstName() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const id = faker.datatype.number();

    supertest(app)
      .put(`/wallets/${id}`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', '"namem" is not allowed');

        doc
          .path('/wallets')
          .addParameters({
            in: 'path',
            name: 'id',
            example: id,
            allowEmptyValue: false,
          })
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('put', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid body');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given a request without required headers', (done) => {
    const body = { name: faker.name.firstName() };
    const id = faker.datatype.number();

    supertest(app)
      .put(`/wallets/${id}`)
      .set('Content-type', 'application/json')
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'Missing x-credential-id header');

        doc
          .path('/wallets')
          .addParameters({
            in: 'path',
            name: 'id',
            example: id,
            allowEmptyValue: false,
          })
          .verb('put', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Wallets'] })
          .fromSuperAgentResponse(res, 'invalid headers');

        done();
      });
  });
});

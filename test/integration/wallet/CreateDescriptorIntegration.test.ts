import { Express } from 'express';
import supertest from 'supertest';
import { expect } from 'chai';
import faker from '@faker-js/faker';
import { Repository } from 'typeorm';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from 'http-status';
import { restore, stub } from 'sinon';

import { App } from '../../../src/application/setup/App';
import { doc } from '../../documentation';
import { DescriptorWithId } from '../../../src/domain/wallet/entities/interfaces/IDescriptor';

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

describe('POST /wallets/{id}/descriptors', () => {
  it('should return 201 CREATED', (done) => {
    const walletId = faker.datatype.number();
    const body = { name: faker.lorem.word(), description: faker.lorem.sentence() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    const savedDescriptor: DescriptorWithId = {
      walletId,
      id: faker.datatype.number(),
      name: body.name,
      description: body.description,
      enabled: true,
    };

    const save = stub(Repository.prototype, 'save').resolves(savedDescriptor);

    supertest(app)
      .post(`/wallets/${walletId}/descriptors`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(CREATED)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id').to.be.equal(savedDescriptor.id);
        expect(save).to.be.calledOnceWith({ walletId, name: body.name, description: body.description, enabled: true });

        doc
          .path(`/wallets/${walletId}/descriptors`)
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', {
            requestBody: { content: body, mediaType: 'application/json' },
            tags: ['Wallets', 'Descriptors'],
          })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid body', (done) => {
    const walletId = faker.datatype.number();
    const body = { description: faker.lorem.sentence() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    supertest(app)
      .post(`/wallets/${walletId}/descriptors`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal('"name" is required');

        doc
          .path(`/wallets/${walletId}/descriptors`)
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', {
            requestBody: { content: body, mediaType: 'application/json' },
            tags: ['Wallets', 'Descriptors'],
          })
          .fromSuperAgentResponse(res, 'invalid body');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid path', (done) => {
    const walletId = faker.lorem.word();
    const body = { name: faker.lorem.word(), description: faker.lorem.sentence() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };

    supertest(app)
      .post(`/wallets/${walletId}/descriptors`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal('"wallet_id" must be a number');

        doc
          .path(`/wallets/${walletId}/descriptors`)
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', {
            requestBody: { content: body, mediaType: 'application/json' },
            tags: ['Wallets', 'Descriptors'],
          })
          .fromSuperAgentResponse(res, 'invalid path');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given a request without required headers', (done) => {
    const walletId = faker.datatype.number();
    const body = { name: faker.lorem.word(), description: faker.lorem.sentence() };
    const headers = { [faker.lorem.word()]: faker.datatype.uuid() };

    supertest(app)
      .post(`/wallets/${walletId}/descriptors`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal('Missing x-credential-id header');

        doc
          .path(`/wallets/${walletId}/descriptors`)
          .verb('post', {
            requestBody: { content: body, mediaType: 'application/json' },
            tags: ['Wallets', 'Descriptors'],
          })
          .fromSuperAgentResponse(res, 'invalid headers');

        done();
      });
  });

  it('should return 500 INTERNAL_SERVER_ERROR when database is down', (done) => {
    const walletId = faker.datatype.number();
    const body = { name: faker.lorem.word(), description: faker.lorem.sentence() };
    const headers = { ['x-credential-id']: faker.datatype.uuid() };
    const message = faker.lorem.sentence();
    const save = stub(Repository.prototype, 'save').rejects(new Error(message));

    supertest(app)
      .post(`/wallets/${walletId}/descriptors`)
      .set('Content-type', 'application/json')
      .set(headers)
      .send(body)
      .expect(INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.equal(message);
        expect(save).to.be.calledOnceWith({ walletId, name: body.name, description: body.description, enabled: true });

        doc
          .path(`/wallets/${walletId}/descriptors`)
          .addParameters({
            in: 'header',
            name: 'x-credential-id',
            example: headers['x-credential-id'],
            allowEmptyValue: false,
          })
          .verb('post', {
            requestBody: { content: body, mediaType: 'application/json' },
            tags: ['Wallets', 'Descriptors'],
          })
          .fromSuperAgentResponse(res, 'internal error');

        done();
      });
  });
});

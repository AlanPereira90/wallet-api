import 'reflect-metadata';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { container } from 'tsyringe';
import { Repository } from 'typeorm';

import './setupEnvVars';

import '../src/domain/config/di';
import '../src/application/config/di';
import { stub } from 'sinon';

container.registerInstance('PostgresConnection', {
  //@ts-ignore
  getRepository: { create: stub().resolves() } as Repository<any>,
});

chai.use(sinonChai);
chai.use(chaiAsPromised);

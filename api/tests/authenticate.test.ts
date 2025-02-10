import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { postRegisterUser } from '../routes/authenticate/authenticate.controllers';
import { users } from '../models-init/init-models';
import { hashSync, compareSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import { authenticateLogger as log } from '../server/winstonLog';

describe('postRegisterUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusStub: sinon.SinonStub;
  let sendStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
        role: 'user',
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub() as unknown as NextFunction;
    statusStub = res.status as sinon.SinonStub;
    sendStub = res.send as sinon.SinonStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 401 if user already exists', async () => {
    sinon.stub(users, 'findOne').resolves({} as any);

    await postRegisterUser(req as Request, res as Response, next);

    expect(statusStub.calledWith(401)).to.be.true;
    expect(sendStub.calledWith('User already exists')).to.be.true;
  });

  it('should return 422 if user creation fails', async () => {
    sinon.stub(users, 'findOne').resolves(null);
    sinon.stub().callsFake(() => 'hashedPassword');
    sinon.stub().callsFake(() => 'uuid');
    sinon.stub(users, 'create').resolves({} as any);

    await postRegisterUser(req as Request, res as Response, next);

    expect(statusStub.calledWith(422)).to.be.true;
    expect(sendStub.calledWith('User not created')).to.be.true;
  });

  it('should return 201 and created user if user creation succeeds', async () => {
    const createdUser = {
      id: randomUUID(),
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'John',
      surname: 'Doe',
      role: 'user',
      active: true,
    };
    sinon.stub(users, 'findOne').resolves(null);
    sinon.stub().callsFake(() => 'uuid');
    sinon.stub(users, 'create').resolves(users.build(createdUser));

    await postRegisterUser(req as Request, res as Response, next);

    expect(statusStub.calledWith(201)).to.be.true;
    expect(sendStub.calledWith(createdUser)).to.be.true;
  });

  it('should log error and call next with error if an exception occurs', async () => {
    const error = new Error('Test error');
    sinon.stub(users, 'findOne').throws(error);
    const logStub = sinon.stub(log, 'log');

    await postRegisterUser(req as Request, res as Response, next);

    expect(logStub.calledWith('error', `URL undefined, error: ${error}`)).to.be.true;
    expect((next as sinon.SinonStub).calledWith(error)).to.be.true;
  });
});
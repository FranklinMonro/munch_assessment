import { expect, use as ChaiUse } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
ChaiUse(sinonChai);
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { productsLogger as log } from '../server/winstonLog';
import { SEQUILIZE_NEW } from '../server/config';
import { initModels, productsAttributes } from '../models-init/init-models';
import { postProducts, getProducts, patchProducts, deleteProducts, postBuy, getHistory } from '../routes/products/products.controllers';

const { products, invoices } = initModels(SEQUILIZE_NEW);

describe('Products Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      baseUrl: '',
      userID: 'test-user-id'
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };
    next = sinon.stub() as unknown as NextFunction;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('postProducts', () => {
    it('should create a new product', async () => {
      req.body = {
        name: 'Test Product',
        price: 100,
        qty: 10,
        description: 'Test Description',
        upsells_to: [''],
        active: true
      };

      sandbox.stub(products, 'findOne').resolves(null);
      sandbox.stub(products, 'create').resolves(req.body);

      await postProducts(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith(req.body);
    });

    it('should return 401 if product already exists', async () => {
      req.body = { name: 'Test Product' };

      sandbox.stub(products, 'findOne').resolves(req.body);

      await postProducts(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(401);
      expect(res.send).to.have.been.calledWith('Product already exists');
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const productsList = [products.build({
        name: 'Product 1',
        id: '',
        active: false
      }), products.build({
        name: 'Product 2',
        id: '',
        active: false
      })];
      sandbox.stub(products, 'findAll').resolves(productsList);

      await getProducts(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith(productsList);
    });
  });

  describe('patchProducts', () => {
    it('should update a product', async () => {
      req.body = { id: 'test-id', name: 'Updated Product' };
      sandbox.stub(products, 'update').resolves([1]);

      await patchProducts(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith([1]);
    });

    it('should return 404 if product not updated', async () => {
      req.body = { id: 'test-id', name: 'Updated Product' };
      sandbox.stub(products, 'update').resolves([0]);

      await patchProducts(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.send).to.have.been.calledWith('Product not updated');
    });
  });

  describe('deleteProducts', () => {
    it('should log deleteProducts', async () => {
      const consoleSpy = sandbox.spy(console, 'log');

      await deleteProducts(req as Request, res as Response, next);

      expect(consoleSpy).to.have.been.calledWith('deleteProducts');
    });
  });

  describe('postBuy', () => {
    it('should create an invoice', async () => {
      req.body = [{ id: 'product-id', qty: 1, upsells_to: [''] }];
      sandbox.stub(products, 'findOne').resolves(null);
      sandbox.stub(products, 'decrement').resolves();

      await postBuy(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith({ id: 'invoice-id' });
    });
  });

  describe('getHistory', () => {
    it('should return user history', async () => {
      const history = [invoices.build({ id: 'invoice-id', fk_user_id: 'test-user-id' })];
      sandbox.stub(invoices, 'findAll').resolves(history);

      await getHistory(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith(history);
    });
  });
});
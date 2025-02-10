import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { productsLogger as log } from '../../server/winstonLog';
import {  SEQUILIZE_NEW } from '../../server/config';
import { initModels, productsAttributes } from '../../models-init/init-models';

const { products, invoices } = initModels(SEQUILIZE_NEW);


const postProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      name = '', 
      price = 0, 
      qty = 0, 
      description = '', 
      upsells_to = [''], 
      active = false
    } = req.body;
    const productExists = await products.findOne({ where: { name } });
    if (productExists) {
      res.status(401).send('Product already exists');
    }
    const productCreate = await products.create({
      id: randomUUID(),
      name,
      price,
      qty,
      description,
      upsells_to,
      active,
    }).catch((error: Error) => {
      log.log('error', `URL ${req.baseUrl}, error: ${error}`);
      throw new Error(error.message);
    });
    res.status(201).send(productCreate);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsFindAll = await products.findAll().catch((error: Error) => {
      log.log('error', `URL ${req.baseUrl}, error: ${error}`);
      throw new Error(error.message);
    });
    res.status(200).send(productsFindAll);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const patchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productPatch = await products.update(req.body, 
      { where: { 
        id: req.body.id 
      } 
    }).catch((error: Error) => {
      log.log('error', `URL ${req.baseUrl}, error: ${error}`);
      throw new Error(error.message);
    });

    if (productPatch[0] === 0) {
      res.status(404).send('Product not updated');
    }

    res.status(200).send(productPatch);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const deleteProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('deleteProducts');
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const postBuy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsBuy = req.body as productsAttributes[];
    const upsell = productsBuy.map(async (product) => {
      if (product.upsells_to && product.upsells_to.length > 0) {
          if (product.upsells_to.length === 1 && product.upsells_to[0] !== '') {
            return undefined;
          }
          return Promise.all(product.upsells_to.map(async (upsell) => {
            if (upsell !== '') {
              const upsellProduct = await products.findOne({
                where: { id: upsell },
                raw: true,
              }).catch((error: Error) => {
                log.log('error', `URL ${req.baseUrl}, error: ${error}`);
                throw new Error(error.message);
              });
              if (upsellProduct) { 
                upsellProduct.qty = product.qty;
                return upsellProduct;
              } else {
                return null;
              }
            }
          }));
      }
        
    });
    const upsellProducts = (await Promise.all(upsell).then((result) => result)).flat().filter((notNull) => notNull);
    if (upsellProducts !== null && upsellProducts !== undefined) {
      upsellProducts.forEach(async (upsellProduct) => {
        productsBuy.push(upsellProduct!);
      });
    }
    productsBuy.forEach(async (product) => {
      await products.decrement('qty', { by: product.qty, where: { id: product.id } }).catch((error: Error) => {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        throw new Error(error.message);
      });
    });
    const createInvoice = await invoices.create({
      id: randomUUID(),
      fk_user_id: 'ab382623-e790-40bd-b892-d33f642380d9',
      items: productsBuy,
    }).catch((error: Error) => {
      log.log('error', `URL ${req.baseUrl}, error: ${error}`);
      throw new Error(error.message);
    });
    res.status(201).send(createInvoice);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

export {
  postProducts,
  getProducts,
  patchProducts,
  deleteProducts,
  postBuy,
};
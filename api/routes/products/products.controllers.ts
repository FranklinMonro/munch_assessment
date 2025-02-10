import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { productsLogger as log } from '../../server/winstonLog';
import {  SEQUILIZE_NEW } from '../../server/config';
import { initModels } from '../../models-init/init-models';

const { products } = initModels(SEQUILIZE_NEW);


const postProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      name = '', 
      price = 0, 
      qty = 0, 
      description = '', 
      upsells_to = [''], 
      upsell_from = [''], 
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
      upsell_from,
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
    console.log('patchProducts');
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

export {
  postProducts,
  getProducts,
  patchProducts,
  deleteProducts,
};
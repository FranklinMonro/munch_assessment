import express from 'express';
import { 
  postProducts, 
  getProducts, 
  patchProducts, 
  deleteProducts,
  postBuy,
  getHistory,
} from './products.controllers';
import { jwtTokenVerify } from '../../server/jwtToken';

class ProductsRouter {
  public router = express.Router();

  constructor() {
    this.router.post('', jwtTokenVerify, postProducts);

    this.router.get('', jwtTokenVerify, getProducts);

    this.router.patch('', jwtTokenVerify, patchProducts);

    this.router.delete('', jwtTokenVerify, deleteProducts);

    this.router.post('/buy', jwtTokenVerify, postBuy);

    this.router.get('/history', jwtTokenVerify, getHistory);
  }
}

export default new ProductsRouter().router;
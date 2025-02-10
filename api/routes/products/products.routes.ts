import express from 'express';
import { 
  postProducts, 
  getProducts, 
  patchProducts, 
  deleteProducts,
  postBuy,
} from './products.controllers';

class ProductsRouter {
  public router = express.Router();

  constructor() {
    this.router.post('', /*jwtTokenVerify,*/ postProducts);

    this.router.get('', /*jwtTokenVerify,*/ getProducts);

    this.router.patch('', /*jwtTokenVerify,*/ patchProducts);

    this.router.delete('', /*jwtTokenVerify,*/ deleteProducts);

    this.router.post('/buy', /*jwtTokenVerify,*/ postBuy);
  }
}

export default new ProductsRouter().router;
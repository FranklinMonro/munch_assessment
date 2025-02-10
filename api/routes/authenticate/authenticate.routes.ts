import express from 'express';
import { postRegisterUser, postLoginUser, postLogOutUser } from './authenticate.controllers';

class AuthenticateRouter {
  public router = express.Router();

  constructor() {
    this.router.post('/register', postRegisterUser);

    this.router.post('/login', postLoginUser);

    this.router.post('/logout', postLogOutUser);

  }
}

export default new AuthenticateRouter().router;
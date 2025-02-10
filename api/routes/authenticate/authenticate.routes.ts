import express from 'express';
import { postLogInUser, postLogOutUser } from './authenticate.controllers';

class AuthenticateRouter {
  public router = express.Router();

  constructor() {
    this.router.post('/login', postLogInUser);

    this.router.post('/logout', postLogOutUser);

  }
}

export default new AuthenticateRouter().router;
import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';

import { authenticateLogger as log } from '../../server/winstonLog';
import { JWT_TOKEN_EXPIRATION, SEQUILIZE_NEW } from '../../server/config';
import { initModels, usersAttributes } from '../../models-init/init-models';
import { jwtTokenSign } from '../../server/jwtToken';


const { users } = initModels(SEQUILIZE_NEW);

const postLogInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email } });
    if (!user) {
      res.status(401).send('User not found');
      return;
    }
    if (!compareSync(password, user.password)) {
      res.status(401).send('Invalid password');
      return;
    }
    const token = jwtTokenSign(user.id);
    res.status(200).send(token);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const postLogOutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('body', req.body);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

export {
  postLogInUser,
  postLogOutUser,
}

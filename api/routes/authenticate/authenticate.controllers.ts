import { Request, Response, NextFunction } from 'express';
import { hashSync, compareSync } from 'bcrypt';
import { randomUUID } from 'crypto';

import { authenticateLogger as log } from '../../server/winstonLog';
import { BRCRYPT_SALT, JWT_TOKEN_EXPIRATION, SEQUILIZE_NEW } from '../../server/config';
import { initModels, usersAttributes } from '../../models-init/init-models';
import { jwtTokenSign } from '../../server/jwtToken';

const { users } = initModels(SEQUILIZE_NEW);

const postRegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, surname, role } = req.body;
    const userFind = await users.findOne({ where: { email } });
    if (userFind) {
      res.status(401).send('User already exists');
      return;
    }
    const hashedPassword = hashSync(password, BRCRYPT_SALT);

    const createUser = await users.create({
      id: randomUUID(),
      email,
      password: hashedPassword,
      name,
      surname,
      role,
      active: true,
    });
   
    if (!createUser) {
      res.status(422).send('User not created');
      return;
    } 
    res.status(201).send(createUser);
  } catch (error) {
    log.log('error', `URL ${req.baseUrl}, error: ${error}`);
    next(error);
  }
};

const postLoginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email } });
    if (!user) {
      console.log('user not found');
      res.status(422).send('User not found');
      return;
    }
    if (!compareSync(password, user.password)) {
      console.log('invalid details');
      res.status(401).send('Invalid details');
      return;
    }

    res.status(200).send({
      name: user.name,
      surname: user.surname,
      jwtToken: await jwtTokenSign(user.id),
      expiresIn: JWT_TOKEN_EXPIRATION,
    });
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
  postRegisterUser,
  postLoginUser,
  postLogOutUser,
}

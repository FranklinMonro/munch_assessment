import { DateTime } from 'luxon';

export interface AuthLogIn {
  id?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string,
  surname?: string,
  role?: string;
  jwtToken?: string;
  expiresIn?: number;
}

class User {
  constructor(
    public name: string,
    public surname: string,
    private _token: string,
    private _tokenExpirationDate: DateTime,
  ) {}

  get token() {
    if (!this._tokenExpirationDate || DateTime.now() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export {
  User
}
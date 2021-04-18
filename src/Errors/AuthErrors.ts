import { HttpStatusCode } from '../Types/httpStatus';

export class MissTokenError extends Error {
  code : number;
  constructor (...params : any[]) {
    super(...params);
    this.code = HttpStatusCode.UNAUTHORIZED;
    this.name = 'AUTHENTIFICATION_ERROR';
    this.message = 'No bhcAuth token provided in Authorization header';
  }
}

export class InvalidTokenError extends Error {
  code : number;
  constructor (...params : any[]) {
    super(...params);
    this.code = HttpStatusCode.UNAUTHORIZED;
    this.name = 'AUTHENTIFICATION_ERROR';
    this.message = 'Provided bhcAuth token is invalid';
  }
}

export class PrivilegeError extends Error {
  code : number;
  constructor (...params : any[]) {
    super(...params);
    this.code = HttpStatusCode.FORBIDDEN;
    this.name = 'PRIVILEGES_ERROR';
    this.message = 'Insufficient privileges to access this route';
  }
}
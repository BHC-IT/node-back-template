import { HttpStatusCode } from '../Types/httpStatus';

export class BadRequestError extends Error {
  code : number;
  constructor(errors : any, ...params : any[]) {
    super(...params);
    this.code = HttpStatusCode.BAD_REQUEST;
    this.name = "BAD_REQUEST_ERROR";
    this.message = errors;
  }
}

export class ConflictRequestError extends Error {
  code : number;
  constructor(errors : any, ...params : any[]) {
    super(...params);
    this.code = HttpStatusCode.CONFLICT;
    this.name = "CONFLICT_REQUEST_ERROR";
    this.message = errors;
  }
}

// module.exports = { BadRequestError, ConflictRequestError };

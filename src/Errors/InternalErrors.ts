import { HttpStatusCode } from '../Types/httpStatus';

export default class InternalServerError extends Error {
	code : number;

	constructor (message : string = 'Unexpected condition was encountered', ...params : any) {
    super(...params);
    this.code = HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.name = 'INTERNAL_SERVER_ERROR';
    this.message = message;
  }
}


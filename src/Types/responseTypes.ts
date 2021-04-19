// import { Schema } from 'mongoose';
import { HttpStatusCode } from './httpStatus'

export type TResponder = (IResponseType: IResponseType) => void

export interface IResponseType {
	status: HttpStatusCode,
	message?: string,
	code: string,
	payload?: object
};

export var ResponseType = {
	OK: {status: HttpStatusCode.OK, code: 'OK'},

	BAD_REQUEST: {status: HttpStatusCode.BAD_REQUEST, message:'bad request', code:'BAD_REQUEST'},

	BAD_REQUEST_NOT_FOUND: (attemptedRequest : string) : IResponseType => ({status: HttpStatusCode.NOT_FOUND, message:`endpoint not found : ${attemptedRequest}`, code: 'BAD_REQUEST_NOT_FOUND'}),
};
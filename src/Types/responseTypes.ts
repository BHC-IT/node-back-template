// import { Schema } from 'mongoose';
import { HttpStatusCode } from './httpStatus'

import { IUser } from './user'
import { ICode } from './code'

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

	USER_REGISTERED: {status: HttpStatusCode.CREATED, message:'User registered successfully', code:'USER_REGISTERED'},

	FORBIDDEN: {status: HttpStatusCode.FORBIDDEN, message:'User not allowed', code:'FORBIDDEN'},

	USER_ACTIVATED: {status: HttpStatusCode.OK, message:'user activated successfully', code:'USER_ACTIVATED'},

	CODE_USED: {status: HttpStatusCode.BAD_REQUEST, message:'code already used', code:'CODE_USED'},

	INTERNAL_SERVER_ERROR: {status: HttpStatusCode.INTERNAL_SERVER_ERROR, message:'Internal server error', code:'INTERNAL_SERVER_ERROR'},

	BAD_IP: {status: HttpStatusCode.FORBIDDEN, message:'bad ip', code:'BAD_IP'},

	NO_CONTENT: {status: HttpStatusCode.NO_CONTENT, message:'', code:'NO_CONTENT'},

	NO_SUB : {status: HttpStatusCode.FORBIDDEN, message: 'User is not subscribed', code: 'NO_SUB'},

	USER_INFO: (infos : IUser) : IResponseType => {return {status: HttpStatusCode.OK, payload: infos, code:'USER_INFO'}},

	USER_HISTORY: (calculs : object[]) : IResponseType => {return {status: HttpStatusCode.OK, payload: calculs, code:'USER_HISTORY'}},

	CODE_CREATED: (code : ICode) : IResponseType => {return {status: HttpStatusCode.OK, payload: code, code:'CODE_CREATED'}},

	STRIPE_SESSION_CREATED: (session : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: session, code:'STRIPE_SESSION_CREATED'}},

	STRIPE_SESSION: (session : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: session, code:'STRIPE_SESSION'}},

	STRIPE_PORTAL_SESSION: (session : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: session, code:'STRIPE_PORTAL_SESSION'}},

	WALLS_LIST: (walls : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: walls, code:'WALLS_LIST'}},

	RNS_LIST: (rns : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: rns, code:'RNS_LIST'}},

	COEFS_LIST: (coefs : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: coefs, code:'COEFS_LIST'}},

	EXEC_CALCUL: (calcul : object) : IResponseType => {return {status: HttpStatusCode.OK, payload: calcul, code:'EXEC_CALCUL'}},

	BAD_REQUEST_NOT_FOUND: (attemptedRequest : string) : IResponseType => ({status: HttpStatusCode.NOT_FOUND, message:`endpoint not found : ${attemptedRequest}`, code: 'BAD_REQUEST_NOT_FOUND'}),
};
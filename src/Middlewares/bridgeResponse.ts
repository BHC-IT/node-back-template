import { Response } from 'express';
import { IResponseType } from '../Types/responseTypes'

export default function setResponseFunction ({}, res : Response, next : Function) {
	res.bridgeResponse = (response : IResponseType) : void => {
		if (response.payload)
			res.status(response.status).json(response.payload);
		else
			res.status(response.status).json({message: response.message, code: response.code});
	}
	next();
}
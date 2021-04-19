import { Response } from 'express';
import { IResponseType } from '../Types/responseTypes'

export function backResponse ({}, res : Response, next : Function) {
	res.backResponse = (response : IResponseType) : void => {
		if (response.payload)
			res.status(response.status).json(response.payload);
		else
			res.status(response.status).json({message: response.message, code: response.code});
	}
	next();
}
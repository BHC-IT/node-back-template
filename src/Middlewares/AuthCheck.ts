import { MissTokenError, InvalidTokenError } from "../Errors/AuthErrors";

import * as jwt from 'jwt-simple';

import axios from 'axios';
import { Request, Response } from 'express'

export async function TokenCheck(req : Request, res : Response, next : Function) {
	let token = null;

	try {
		token = req.headers.authorization.split(" ")[1];
	} catch (e) {
		return next(new MissTokenError(e));
	}

	try {
		await axios.get(process.env.AUTH_URL + '/info/verifyToken?token=' + token);
	} catch (e) {
		return next(new InvalidTokenError(e));
	}

	req.body.token = token;
	req.body.user = jwt.decode(token, null, true);
	return next();
}
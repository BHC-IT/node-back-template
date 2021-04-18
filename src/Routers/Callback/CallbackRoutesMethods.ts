import { Schema } from 'mongoose';
import { Request, Response } from 'express'
import axios from 'axios';

import * as Mail from "../../Helpers/Mail";
import logger from "../../Utils/Logger";
import { ResponseType } from '../../Types/responseTypes'

import { ParamsUser } from "../../Model/user";
import InternalServerError from '../../Errors/InternalErrors';

import UserMongoose from "../../Schemas/user.schema";

import { getToken } from '../../Helpers/bhcAPIConnector'

/**
 * Return the contact found with the req.body.contactID mongo identifier
 * @param {Request} req The HTTP request core
 * @param {Result} res The HTTP result
 */
export async function reset(req : Request, res : Response) {
	console.log(req.ip);
	Mail.send(req.body.user.username, "Dosismart : reinitialisation du mot de passe", `code : ${req.body.code}`, (err : Error, i : any) => {
		if (err) {
			logger.info(err);
		}
		logger.info(i);
	});
	res.bridgeResponse(ResponseType.NO_CONTENT);
}

/**
 * Return the contact found with the req.body.contactID mongo identifier
 * @param {Request} req The HTTP request core
 * @param {Result} res The HTTP result
 */
export async function login(req : Request, res : Response) {
	const {user, client} = req.body;

	if (client.access !== "front")
		return res.bridgeResponse(ResponseType.NO_CONTENT);

	const localUser = await UserMongoose.findById(user._id)

	if (client.name === 'dosismart-mobapp' && user.authorized === false)
		// return res.bridgeResponse(ResponseType.NO_SUB)
		return res.bridgeResponse(ResponseType.NO_CONTENT)

	if (localUser.subscriptionDuration < new Date(Date.now())) {
		await axios.patch(process.env.AUTH_URL + '/info/user?id=' + user._id, {
			authorized: false,
		},
		{
			headers: {
				Authorization: 'Bearer ' + getToken()
			},
		});
		return res.bridgeResponse(ResponseType.NO_SUB)
	}

	console.log(user);

	res.bridgeResponse(ResponseType.NO_CONTENT);
}

/**
 * Return the contact found with the req.body.contactID mongo identifier
 * @param {Request} req The HTTP request core
 * @param {Result} res The HTTP result
 */
export async function signin(req : Request, res : Response) {
	const paramsUserValues = {
  		authorized: req.body.user.authorized,
  		validated: req.body.user.validated,
  		tfa: req.body.user.tfa,
  		subscribed: false,
  		activated: false,
  		admin: false,
  	};
  	let paramsUser = await (new ParamsUser(paramsUserValues)).get();
  	const history : Schema.Types.ObjectId[] = [];
  	const user = {
  		_id: req.body.user.id,
  		history: history,
  		orga: "test",
  		params: paramsUser._id,
  		subscriptionDuration: Date.now() - 1,
  		email: req.body.user.username,
  	}
	try {
		await UserMongoose.create(user);
		return res.bridgeResponse(ResponseType.USER_REGISTERED);
	} catch (error) {
		console.log(error);
		throw new InternalServerError('Failed to register user', error);
	}
}
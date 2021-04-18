import { Request, Response } from 'express'
import { Schema } from 'mongoose';
import axios from 'axios';

import UserMongoose from "../../Schemas/user.schema";
import CodeMongoose, { ICode, makeid } from "../../Schemas/code.schema";

import { ParamsUser, User } from "../../Model/user";

import InternalServerError from '../../Errors/InternalErrors';
import { ResponseType } from '../../Types/responseTypes'

import { getToken } from '../../Helpers/bhcAPIConnector'

export async function register (req : Request , res : Response) {
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
		return new InternalServerError('Failed to register user', error);
	}
}

export async function getUserInfo (req : Request , res : Response) {
	const user = req.body.user;
	try {
		const userInfo = await UserMongoose.findById(user.id);
		return res.bridgeResponse(ResponseType.USER_INFO(userInfo));
	} catch (error) {
		console.log(error);
		return new InternalServerError('Failed to get user informations', error);
	}
}

export async function getHistoryOfUser (req : Request , res : Response) {
	try {
		const calculs = await (new User(req.body.user.id)).getHistory();
		return res.bridgeResponse(ResponseType.USER_HISTORY(calculs));
	} catch (error) {
		console.log(error);
		return new InternalServerError("Failed to get user's history", error);
	}
}

export async function createCode (req : Request , res : Response) {
	try {
		if (req.body.user.username !== 'admin@dosismart.fr') {
			return res.bridgeResponse(ResponseType.FORBIDDEN);
		}
		const code : ICode = await CodeMongoose.create({used: false, code: makeid(8)});
		return res.bridgeResponse(ResponseType.CODE_CREATED(code));
	} catch (error) {
		console.log(error);
		res.bridgeResponse(ResponseType.INTERNAL_SERVER_ERROR);
		return new InternalServerError("Failed to create code", error);
	}
}

export async function activateUserWithCode (req : Request , res : Response) {
	try {
		const code = await CodeMongoose.findOne({code: req.body.code}).exec();
		const user = await UserMongoose.findById(req.body.user.id);
		if (!code || code.used) {
			return res.bridgeResponse(ResponseType.CODE_USED);
		}
		await axios.patch(process.env.AUTH_URL + '/info/user?id=' + req.body.user.id, {
			authorized: true,
		},
		{
			headers: {
				Authorization: 'Bearer ' + getToken()
			},
		});
		code.used = true;
		user.subscriptionDuration = new Date(Date.now() + mounths(1));
		code.save();
		user.save();
		return res.bridgeResponse(ResponseType.USER_ACTIVATED);
	} catch (error) {
		console.log(error);
		res.bridgeResponse(ResponseType.INTERNAL_SERVER_ERROR);
		return new InternalServerError("Failed to get user's history", error);
	}
}

export const secondes = (sec : number) : number => sec * 1000

export const minutes = (min : number) : number => min * secondes(60)

export const hours = (h : number) : number => h * minutes(60)

export const days = (d : number) : number => d * hours(24)

export const weeks = (w : number) : number => w * days(7)

export const mounths = (m : number) : number => m * weeks(4)

export const years = (y : number) : number => y * mounths(12)

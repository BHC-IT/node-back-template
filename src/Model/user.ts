import { IParamsUser, ICalcul/*, IUser*/ } from '../Types/user'
import ParamsUserMongoose from "../Schemas/paramsUser.schema";
import UserMongoose from "../Schemas/user.schema";
import { Schema } from 'mongoose';

export class ParamsUser {
	authorized : boolean;
	validated : boolean;
	tfa : boolean;
	subscribed : boolean;
	activated : boolean;
	admin : boolean;

	constructor(infos : any) {
		this.authorized = infos.authorized ? infos.authorized : false;
		this.validated = infos.validated ? infos.validated : false;
		this.tfa = infos.tfa ? infos.tfa : false;
		this.subscribed = infos.subscribed ? infos.subscribed : false;
		this.activated = infos.activated ? infos.activated : false;
		this.admin = infos.admin ? infos.admin : false;
	}

	async get() : Promise<IParamsUser> {
		const params : object = {
			authorized: this.authorized ? this.authorized : false,
			validated: this.validated ? this.validated : false,
			tfa: this.tfa ? this.tfa : false,
			subscribed: this.subscribed ? this.subscribed : false,
			activated: this.activated ? this.activated : false,
			admin: this.admin ? this.admin : false,
		};
		let paramsUserInDB = await ParamsUserMongoose.findOne(params);
		if (!paramsUserInDB){
			paramsUserInDB = await ParamsUserMongoose.create(params);
		}
		return paramsUserInDB;
	}
}

const populateWall = {path: 'history', populate: {path: 'params', populate: {path: 'walls.materialID', select: 'name', populate: {path: 'name'}}}};
const populateCoef = {path: 'history', populate: {path: 'params', populate: {path: 'coef', select: ['name', 'unit']}}};
const populateRN = {path: 'history', populate: {path: 'params', populate: {path: 'rn', populate: {path: 'isotopes', select: 'name'}}}};

export class User {
	id : Schema.Types.ObjectId;

	constructor(id : Schema.Types.ObjectId) {
		this.id = id;
	}

	async getHistory() : Promise<ICalcul[]> {
		const userInfo = await UserMongoose.findById(this.id).populate(populateWall).populate(populateCoef).populate(populateRN).exec();
 		return userInfo.history;
	}

	async addSubsciptionForXMonth(nbMonth : number) {
		const userInfo = await UserMongoose.findById(this.id).exec();
		const oldParamsUser = await ParamsUserMongoose.findById(userInfo.params);
		let newParamsUserObject : IParamsUser;
		if (!oldParamsUser.subscribed) {
			let newParamsUser = {
				authorized: oldParamsUser.authorized,
				validated: oldParamsUser.validated,
				tfa: oldParamsUser.tfa,
				subscribed: true,
				activated: oldParamsUser.activated,
				admin: oldParamsUser.admin,
			};
			newParamsUserObject = await (new ParamsUser(newParamsUser)).get();
		} else {
			newParamsUserObject = oldParamsUser;
		}
		const today = new Date();
		await UserMongoose.updateOne({_id: this.id}, {
			params: newParamsUserObject._id,
			subscriptionDuration: oldParamsUser.subscribed ? new Date(userInfo.subscriptionDuration.setMonth(userInfo.subscriptionDuration.getMonth() + nbMonth)) : new Date(today.setMonth(today.getMonth() + nbMonth)),
		});
	}

	async disableSubscription() {
		const userInfo = await UserMongoose.findById(this.id).exec();
		const oldParamsUser = await ParamsUserMongoose.findById(userInfo.params);
		const newParamsUser = {
			authorized: oldParamsUser.authorized,
			validated: oldParamsUser.validated,
			tfa: oldParamsUser.tfa,
			subscribed: false,
			activated: oldParamsUser.activated,
			admin: oldParamsUser.admin,
		};
		const newParamsUserObject = await (new ParamsUser(newParamsUser)).get();
		await UserMongoose.updateOne({_id: this.id}, {params: newParamsUserObject._id});
	}
}
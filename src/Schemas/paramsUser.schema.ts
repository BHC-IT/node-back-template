import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IParamsUser } from '../Types/user'

export const ParamsUserSchema = new Schema(
	{
		subscribed: {type: Boolean, required: true},
		activated: {type: Boolean, required: true},
		admin: {type: Boolean, required: true},
		authorized: {type: Boolean, required: true},
		validated: {type: Boolean, required: true},
		tfa: {type: Boolean, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

ParamsUserSchema.plugin(uniqueValidator);

export {IParamsUser as IParamsUser};

export default model<IParamsUser>('paramsUser', ParamsUserSchema, 'paramsUser');;

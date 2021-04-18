import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IUser } from '../Types/user'

export const UserSchema = new Schema(
	{
		orga: {type: String},
		history: [{type: Schema.Types.ObjectId, ref: 'calcul'}],
		params: {type: Schema.Types.ObjectId, ref: 'paramsUser'},
		subscriptionDuration: {type: Date},
		email: {type: String},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

UserSchema.plugin(uniqueValidator);

export {IUser as IUser};

export default model<IUser>('user', UserSchema, 'user');;

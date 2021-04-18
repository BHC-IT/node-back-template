import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { ICode } from '../Types/code'

export function makeid(length : number) {

	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;

	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const CodeSchema = new Schema(
	{
		used: {type: Boolean, required: true},
		code: {type: String, required: true, index: true, unique: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

CodeSchema.plugin(uniqueValidator);

export {ICode as ICode};

export default model<ICode>('code', CodeSchema, 'code');;

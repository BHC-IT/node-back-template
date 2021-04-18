import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IName } from '../Types/name'

export const NameSchema = new Schema(
	{
		fr: {type: String, required: true},
		en: {type: String, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

NameSchema.plugin(uniqueValidator);

export {IName as IName};

export default model<IName>('name', NameSchema, 'name');;

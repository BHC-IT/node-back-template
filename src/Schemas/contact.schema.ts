import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IContact } from '../Types/contact'

export const ContactSchema = new Schema(
	{
		name: {type: String, required: true},
		email: {type: String, required: true},
		job: {type: String, required: true},
		message: {type: String, required: true},
		newsletter: {type: Boolean, required: true},
		beta: {type: Boolean, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

ContactSchema.plugin(uniqueValidator);

export {IContact as IContact};

export default model<IContact>('contact', ContactSchema, 'contact');;

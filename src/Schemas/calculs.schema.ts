import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { ICalcul } from '../Types/calculs'

export const CalculMultiplyerSchema = new Schema(
	{
		activity: {type: Number, required: false},
		distance: {type: Number, required: false},
		thickness: {type: [Number], required: false},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export const CalculSchema = new Schema(
	{
		date: {type: Number, required: true},
		params: {type: Schema.Types.ObjectId, required: true, ref: 'paramsCalcul'},
		result: {type: Number, required: true},
		unit: {type: String, required: true},
		multiplyer: {type: CalculMultiplyerSchema, required: false}
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

CalculSchema.plugin(uniqueValidator);

export {ICalcul as ICalcul};

export default model<ICalcul>('calcul', CalculSchema, 'calcul');;

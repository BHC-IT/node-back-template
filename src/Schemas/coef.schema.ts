import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { ICoef, IInfosCoef } from '../Types/coef'

export const InfosCoefSchema = new Schema(
	{
		kev: {type: Number, required: true},
		h: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export const CoefSchema = new Schema(
	{
		name: {type: String, required: true},
		mod: [{type: InfosCoefSchema, required: true}],
		unit: {type: String, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

CoefSchema.plugin(uniqueValidator);

export {IInfosCoef as IInfosCoef};
export {ICoef as ICoef};

export default model<ICoef>('coef', CoefSchema, 'coef');;

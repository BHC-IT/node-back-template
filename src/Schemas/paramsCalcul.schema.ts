import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IParamsCalcul } from '../Types/calculs'

export const ParamsCalculSchema = new Schema(
	{
		activity: {type: Number, required: true},
		distance: {type: Number, required: true},
		rn: {type: Schema.Types.ObjectId, required: true, ref: 'radioNucleide'},
		coef: {type: Schema.Types.ObjectId, required: true, ref: 'coef'},
		walls: [{
			thickness: {type: Number, required: true},
			materialID: {type: Schema.Types.ObjectId, required: true, ref: 'wall'}
		}],
		iso: {type: String, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

ParamsCalculSchema.plugin(uniqueValidator);

export {IParamsCalcul as IParamsCalcul};

export default model<IParamsCalcul>('paramsCalcul', ParamsCalculSchema, 'paramsCalcul');;

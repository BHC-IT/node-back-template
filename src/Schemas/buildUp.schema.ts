import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IBU, IDetailBuildUp } from '../Types/wall'

export const DetailBuildUpSchema = new Schema(
	{
		kev: {type: Number, required: true},
		bu: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export const BuildUpSchema = new Schema(
	{
		bu: {type: [DetailBuildUpSchema], required: true},
		rmfp: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

BuildUpSchema.plugin(uniqueValidator);

export {IBU as IBU};
export {IDetailBuildUp as IDetailBuildUp};

export default model<IBU>('BU', BuildUpSchema, 'BU');;

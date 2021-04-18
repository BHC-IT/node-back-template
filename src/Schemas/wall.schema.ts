import { Schema, model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { IWall, IAtt } from '../Types/wall'

export const AttSchema = new Schema(
	{
		kev: {type: Number, required: true},
		mu: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export const WallSchema = new Schema(
	{
		name: {type: Schema.Types.ObjectId, required: true, ref: 'name'},
		att: {type: [AttSchema], required: true},
		bu: {type: [Schema.Types.ObjectId], required: true, ref: 'buildUp'},
		rho: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

WallSchema.plugin(uniqueValidator);

export {IWall as IWall};
export {IAtt as IAtt};

export default model<IWall>('wall', WallSchema, 'wall');;

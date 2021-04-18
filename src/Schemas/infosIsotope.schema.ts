import { Schema, model } from 'mongoose';

import { IInfosIsotope } from '../Types/radionucleide'

export const InfosIsotopeSchema = new Schema(
	{
		kev: {type: Number, required: true},
		intensity: {type: Number, required: true},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export {IInfosIsotope as IInfosIsotope};

export default model<IInfosIsotope>('infosIsotope', InfosIsotopeSchema, 'infosIsotope');;

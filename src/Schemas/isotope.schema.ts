import { Schema, model } from 'mongoose';

import { IIsotope } from '../Types/radionucleide'
import { InfosIsotopeSchema } from './infosIsotope.schema'

export const IsotopeSchema = new Schema(
	{
		name: {type: String, required: true},
		ray: {type: [InfosIsotopeSchema], required: true, ref: 'infosIsotope'},
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export {IIsotope as IIsotope};

export default model<IIsotope>('isotope', IsotopeSchema, 'isotope');;

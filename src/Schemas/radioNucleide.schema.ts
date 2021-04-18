import { Schema, model } from 'mongoose';

import { IRadioNucleide } from '../Types/radionucleide'

export const RadioNucleideSchema = new Schema(
	{
		symbol: {type: String, required: true},
		isotopes: [{type: Schema.Types.ObjectId, required: true, ref: 'isotope'}],
	},
  	{
  		timestamps: {
  			createdAt: true
  		}
  	}
);

export {IRadioNucleide as IRadioNucleide};

export default model<IRadioNucleide>('radioNucleide', RadioNucleideSchema, 'radioNucleide');;

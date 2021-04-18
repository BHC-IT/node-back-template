import { Document, Schema } from 'mongoose';

export interface IInfosIsotope extends Document {
	_id: Schema.Types.ObjectId, //primary key
	kev: number,
	intensity: number,
}

export interface IIsotope extends Document {
	_id: Schema.Types.ObjectId, //primary key
	ray: Schema.Types.ObjectId[], //refer to infosIsotope
	name: string,
}

export interface IRadioNucleide extends Document {
	_id: Schema.Types.ObjectId, //primary key
	isotopes: Schema.Types.ObjectId[], // refer to isotope
	symbol: string,
}

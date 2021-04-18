import { Document, Schema } from 'mongoose';

export interface IInfosCoef extends Document {
	kev: number,
	h: number,
}

export interface ICoef extends Document {
	_id: Schema.Types.ObjectId, //primary key
	name: string,
	mod: IInfosCoef[],
	unit: string,
}


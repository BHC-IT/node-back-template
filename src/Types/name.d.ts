import { Document, Schema } from 'mongoose';

export interface IName extends Document {
	_id: Schema.Types.ObjectId, //primary key
	fr: string,
	en: string,
}
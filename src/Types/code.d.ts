import { Document } from 'mongoose';

export interface ICode extends Document {
	_id: string, //primary key
	used: boolean,
	code: string,
}
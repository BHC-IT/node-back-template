import { Document, Schema } from 'mongoose';

export interface IContact extends Document {
	_id: Schema.Types.ObjectId, //primary key
	name: string,
    email: string,
    job: string,
    message: string,
    newsletter: boolean,
    beta: boolean,
}

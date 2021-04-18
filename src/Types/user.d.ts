import { Document, Schema } from 'mongoose';
import { ICalcul } from './calculs'

export interface IUser extends Document {
	_id: Schema.Types.ObjectId, //primary key
	orga: string,
    history: ICalcul[],
    params: Schema.Types.ObjectId, // ref to ParamsUser
    subscriptionDuration: Date,
    email: string,
}

export interface IParamsUser extends Document {
    subscribed: boolean,
    activated: boolean,
    admin: boolean,
    authorized: boolean,
    validated: boolean,
    tfa: boolean,
    get: () => Promise<IParamsUser>,
}

export {ICalcul as ICalcul};

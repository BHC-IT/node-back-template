import { Document, Schema } from 'mongoose';

export interface IAtt extends Document {
	kev: number,
	mu: number,
}

export interface IWall extends Document {
	_id: Schema.Types.ObjectId, // primary key
	name: string,
	rho: number,
	att: IAtt[],
	bu: Schema.Types.ObjectId[],
}

export interface IBU extends Document {
	_id: Schema.Types.ObjectId, // primary key
	rmfp: number,
	bu: Schema.Types.ObjectId[],
}

export interface IDetailBuildUp extends Document {
	_id: Schema.Types.ObjectId, // primary key
	kev: number,
	bu: number,
}
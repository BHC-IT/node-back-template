import { Document, Schema } from 'mongoose';

export interface ICalculMultiplyer {
	activity?: number,
	distance?: number,
	thickness?: number[],
}

export interface IResult {
	result: number,
	unit: string,
}

export interface ICalcul extends Document {
	_id: Schema.Types.ObjectId, //primary key
	date: number,
	params: Schema.Types.ObjectId, //ref to ParamsCalcul
	result: number,
	unit:string,
	multiplyer?: ICalculMultiplyer,
}

export interface IWallsInfo {
	thickness: number,
	materialID: Schema.Types.ObjectId[],
}

export interface IParamsCalcul extends Document {
	_id: Schema.Types.ObjectId,
	activity: number,
	distance: number,
	iso: string,
	rn: Schema.Types.ObjectId, //ref to RadioNucleide
	coef: Schema.Types.ObjectId, //ref to Coef
	walls: IWallsInfo[], //ref to Walls
}
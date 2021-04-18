import * as util from 'util';
import { Schema } from 'mongoose';
// import * as mongoose from 'mongoose';
import { Request, Response } from 'express'

import logger from "../../Utils/Logger";
import TCP from '../../Helpers/CppBridge';
import { ResponseType } from '../../Types/responseTypes'
import { IResult } from '../../Types/calculs'
import InternalServerError from '../../Errors/InternalErrors';

import NameMongoose from "../../Schemas/name.schema";
import CoefMongoose, { ICoef, IInfosCoef } from "../../Schemas/coef.schema";
import UserMongoose from "../../Schemas/user.schema";
import CalculsMongoose from "../../Schemas/calculs.schema";
import IsotopeMongoose from "../../Schemas/isotope.schema";
import ParamsCalculMongoose from "../../Schemas/paramsCalcul.schema";
import WallMongoose, { IWall, IAtt } from "../../Schemas/wall.schema";
import BuildUpMongoose, { IDetailBuildUp } from "../../Schemas/buildUp.schema";
import RnMongoose, { IRadioNucleide } from "../../Schemas/radioNucleide.schema";

import { RadioNucleide } from "../../Model/radioNucleide";

/**
 * Send a response with the list of the supported wall materials.
 * @param {Request} req HTTP Request object
 * @param {Result} res HTTP Result object
 */
 export async function getWallList (req : Request, res : Response) {
 	const acceptedLanguage = req.headers['accept-language']?req.headers['accept-language'].split('-')[0]:'fr';
 	const walls : IWall[] = await WallMongoose.find({});
 	let retour : Object[] = [];
 	await Promise.all(walls.map(async (e : IWall) => {
 		const name = await NameMongoose.findById(e.name);
 		retour.push({id: e._id, name: name.get(acceptedLanguage), lang: acceptedLanguage});
 	}));
	return res.bridgeResponse(ResponseType.WALLS_LIST(retour));
 }

/**
 * Send a response with the list of the supported radionucleides.
 * @param {Request} req HTTP Request object
 * @param {Result} res HTTP Result object
 */
export async function getRNList (req : Request, res : Response) {
	const allRns : IRadioNucleide[] = (await RnMongoose.find({}));
	const rns = await Promise.all(allRns.map(async (rn : IRadioNucleide) => {
		let iso = await Promise.all(rn.isotopes.map(async (iso : Schema.Types.ObjectId) => {
			return (await IsotopeMongoose.findById(iso)).name
		}));
		return {id: rn._id, name: rn.symbol, iso: iso};
	}));
	return res.bridgeResponse(ResponseType.RNS_LIST(rns));
 }

export async function getCoefList(req : Request, res : Response) {
	return res.bridgeResponse(ResponseType.COEFS_LIST((await CoefMongoose.find({})).map(coef => ({id: coef._id, unit: coef.unit, name: coef.name}))));
}

function interpolate(x : number, x1 : number, y1 : number, x2 : number, y2 : number) {
	if (y1 === y2)
		return y1;
	const upDiff = y1 - y2;
	const downDiff = x1 - x2;

	const frac = upDiff / downDiff;

	return ( y1 + (x - x1) * frac );
}

async function getH(rnKev : number, coefMod  : IInfosCoef[]){
	const offset = coefMod.findIndex((w : any) => { return w.kev > rnKev});
	const low = coefMod[offset === -1 ? coefMod.length - 1 : offset - 1];
	const supp = coefMod[offset === -1 ? coefMod.length - 1 : offset];

	return interpolate(rnKev, low.kev, low.h, supp.kev, supp.h);
}

function getBuInRMFP(bu : any, kev : number) {
	const offset = bu.findIndex((e : IDetailBuildUp) => e.kev > kev);
	const low = bu[offset === -1 ? bu.length - 1 : offset - 1];
	const supp = bu[offset === -1 ? bu.length - 1 : offset];

	return interpolate(kev, low.kev, low.bu, supp.kev, supp.bu);
}

function getBuildUp(currBuildUp : any, rmfp : any, kev : number, print : boolean = false) {
	const offsetBuildUp = currBuildUp.findIndex((b : any) => b.rmfp > rmfp);
	const low = currBuildUp[offsetBuildUp === -1 ? currBuildUp.length - 1 : offsetBuildUp - 1];
	const supp = currBuildUp[offsetBuildUp === -1 ? currBuildUp.length - 1 : offsetBuildUp];

	const lowBu = getBuInRMFP(low.bu, kev);
	const suppBu = getBuInRMFP(supp.bu, kev);

	if (print) {
		logger.info('low : ' + util.inspect(low, {showHidden: false, depth: null}));
		logger.info('supp : ' + util.inspect(supp, {showHidden: false, depth: null}));
		logger.info('lowBu : ' + lowBu);
		logger.info('suppBu : ' + suppBu);
	}

	return interpolate(rmfp, low.rmfp, lowBu, supp.rmfp, suppBu);
}

function getµ(kev : number, currWall : any) {
	// Current bd format for wall is broken, this is a runtime fix
	const offset = currWall.att.findIndex((w : IAtt) => w.kev > kev);
	const low : IAtt = currWall.att[offset === -1 ? currWall.att.length - 1 : offset - 1];
	const supp : IAtt = currWall.att[offset === -1 ? currWall.att.length - 1 : offset];

	return interpolate(kev, low.kev, low.mu, supp.kev, supp.mu);
}

export async function run (req : Request, res : Response, next : Function) {

 	const reqWalls = req.body.walls ? (req.body.walls.length ? req.body.walls : undefined) : null;
	const buildUp : any = reqWalls ? await Promise.all(reqWalls.map(async(e : any) => {
		let bu_IDs : Schema.Types.ObjectId[] = (await WallMongoose.findById(e.materialID)).bu;
		return await BuildUpMongoose.find({_id : {$in: bu_IDs}});
	})) : null;
	const coef : ICoef = await CoefMongoose.findById(req.body.coef);
	try {
		let isoID = await (new RadioNucleide(req.body.rn)).getIsotopeID(req.body.iso);
		const Ray = (await IsotopeMongoose.findById(isoID)).ray;
		const perEnergy = await Promise.all(Ray.map(async(e : any, rayNb : any) => {
			const infosIso = e;
			return [
				infosIso.intensity,
				await getH(infosIso.kev, coef.mod),
				reqWalls ? await Promise.all(reqWalls.map(async(wall : any, i : number) => {
					let µ = null;
					let bu = null;
					if (reqWalls.length === 2) {
						const w1 = await WallMongoose.findById(reqWalls[0].materialID);
						const w2 = await WallMongoose.findById(reqWalls[1].materialID);
						const µ1 = getµ(infosIso.kev, w1);
						const µ2 = getµ(infosIso.kev, w2);
						const x1 = reqWalls[0].thickness;
						const x2 = reqWalls[1].thickness;
						if (i === 0) {
							µ = µ1;
							bu = getBuildUp(buildUp[1], µ1 * x1 + µ2 * x2, infosIso.kev);
						} else if (i === 1) {
							let bu1 = getBuildUp(buildUp[0], µ1 * x1, infosIso.kev);
							let bu2 = getBuildUp(buildUp[1], µ2 * x2, infosIso.kev);
							µ = µ2;
							bu = bu1 - bu2;
						} else {
							throw new Error("something bad happened")
						}
					} else if (reqWalls.length === 1) {
						const currWall = await WallMongoose.findById(wall.materialID);
						µ = getµ(infosIso.kev, currWall);
						bu = getBuildUp(buildUp[i], µ * wall.thickness, infosIso.kev);
					} else {
						throw new Error("something bad happened")
					}
					return {
						x: wall.thickness,
						mu: µ,
						bu: bu,
					};
				})) : [{x:0, mu:0, bu:1}],
			];
		}));
		await SendPacketToServer(req, res, next, 'Point', {
			distance: req.body.distance,
			activ: req.body.activity,
			perEnergy: perEnergy,
		}, coef.unit);
	} catch (error) {
		logger.error(error);
		return res.bridgeResponse(ResponseType.BAD_REQUEST);
	}
}

async function SendPacketToServer (req : Request, res : Response, next : Function, tag : string, content : any, unit : string) {
	let resp : IResult | null = null;
	try {
		resp = await getResultFromServer(tag, content, unit);
	} catch (error) {
		logger.error(error);
		return next(
			new InternalServerError('Error while communicating with server calcul, please contact api administrator', error)
		);
	}

	try {
		await saveCalculInDB(req.body, resp)
		return res.bridgeResponse(ResponseType.EXEC_CALCUL(resp));
	} catch (error) {
		logger.error(error);
		next(new InternalServerError('Error while processing calcul', error));
	}
}

async function getResultFromServer(tag : string, content : any, unit : string) : Promise<IResult> {
	const sock = new TCP();
	await sock.connect(process.env.DOSI_HOST, Number(process.env.DOSI_PORT));

	const tmp : any = await sock.send(tag, content);

	let resp : IResult = {...JSON.parse(tmp), unit};
	resp.result /= 1000;

	return resp;
}

async function saveCalculInDB(infos : any, res : IResult) {
	let wallsIDs : Schema.Types.ObjectId[] = [];

	console.log(res);

	if (infos.walls){
		wallsIDs = infos.walls.map((e : any) => ({materialID: e.materialID, thickness: e.thickness}));
	}
	const paramsCalcul = await ParamsCalculMongoose.create({
		activity: infos.activity,
		distance: infos.distance,
		rn: infos.rn,
		coef: infos.coef,
		iso: infos.iso,
		walls: wallsIDs,
	});
	const calculCreated : any = await CalculsMongoose.create({
		date: Date.now(),
		params: paramsCalcul._id,
		result: res.result,
		unit: res.unit,
		multiplyer: infos.multiplyer,
	});
	await UserMongoose.updateOne({_id: infos.user.id}, {$push: {history: calculCreated.id}});
}
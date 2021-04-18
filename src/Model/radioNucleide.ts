import RnMongoose from "../Schemas/radioNucleide.schema";
import IsotopeMongoose from "../Schemas/isotope.schema";
import { Schema } from 'mongoose';

export class RadioNucleide {
	id : Schema.Types.ObjectId;

	constructor(id : Schema.Types.ObjectId) {
		this.id = id;
	}

	async getIsotopeID(name : string) : Promise<Schema.Types.ObjectId> {
		const DBrn : any = await RnMongoose.findById(this.id).exec();
		let isoID : Schema.Types.ObjectId;
		await Promise.all(DBrn.isotopes.map(async(e : any) => {
			if ((await IsotopeMongoose.findById(e)).name === name) {
				isoID = e;
			}
		}));
		return isoID;
	}
}
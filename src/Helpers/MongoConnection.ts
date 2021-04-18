import * as mongoose from 'mongoose';

function connect(ip? : string | undefined, port? : number, db? : string | undefined, user? : string, pwd? : string) : void {

	const usedIP = ip;
	const usedPORT = port;
	const usedDB = db;
	const usedUser = user;
	const usedPassword = pwd;

	if (port) {
		console.log(`mongodb://${usedIP}:${usedPORT}/${usedDB}`);
		mongoose.connect(`mongodb://${usedIP}:${usedPORT}/${usedDB}`, {useNewUrlParser: true});
	}
	else {
		console.log(`mongodb+srv://${usedUser}:${usedPassword}@${usedIP}/${usedDB}?retryWrites=true&w=majority`);
		mongoose.connect(`mongodb+srv://${usedUser}:${usedPassword}@${usedIP}/${usedDB}?retryWrites=true&w=majority`, {useNewUrlParser: true});
	}
}

function connected() : Promise<void> {
	let prom : Promise<void> = new Promise((res /*, rej*/) : void => {
		mongoose.connection.once('open', () => {
			res();
		});
	});
	return prom;
}

function close() : void {
	mongoose.connection.close();
}

export {connect, connected, close}
/*
* ENVIRONMENT LOADING
*/
import * as dotenv from 'dotenv';
if (process.env.MODE === "dev") {
	dotenv.config();
}

/*
* EXTERNAL DEPENDENCIES
*/
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from 'express'
import * as morgan from 'morgan';

import { connect, connected } from './Helpers/MongoConnection';
const expressApp = express();
import * as bodyParser from 'body-parser';
import logger, { LoggerStream } from './Utils/Logger';
import BridgeResponse from './Middlewares/bridgeResponse';
import { ResponseType } from './Types/responseTypes'

/*
* Express CONFIGURATION
*/
expressApp.use(cors());
expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.use(BridgeResponse);
expressApp.use(morgan("combined", { stream: new LoggerStream() }));
/*
* ROUTES CONFIGURATION
*/


expressApp.use((req : Request, res : Response) => {
	res.bridgeResponse(ResponseType.BAD_REQUEST_NOT_FOUND(req.url));
});

function mongoConnect() {
	connect(process.env.MONGO_IP, process.env.MONGO_PORT === "null" ? undefined : Number(process.env.MONGO_PORT), process.env.MONGO_DB, process.env.MONGO_USER, process.env.MONGO_PASSWORD);
	return connected();
}


/**
* Main function, Bridge entry point
*
* @async
* @function main
*/
export async function main() {
	await mongoConnect();
	logger.info(`ENVIRONMENT : ${process.env.NODE_ENV}`);

	expressApp.listen(process.env.BRIDGE_PORT, async () => {
		logger.info(`listening on port ${process.env.BRIDGE_PORT}`);
	});
}

main();

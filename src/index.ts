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
import * as Mail from "./Helpers/Mail";
import BridgeResponse from './Middlewares/bridgeResponse';
import { refreshToken } from './Helpers/bhcAPIConnector';
import { ResponseType } from './Types/responseTypes'

/*
* Express CONFIGURATION
*/
expressApp.use(cors());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json({
	verify: function(req : Request, res : Response, buf : Buffer) {
		var url = req.originalUrl;
		if (url.startsWith('/extern/stripe/webhook')) {
			req.rawBody = buf.toString()
		}
	}
}));
expressApp.use(BridgeResponse);
expressApp.use(morgan("combined", { stream: new LoggerStream() }));
/*
* ROUTES CONFIGURATION
*/
import AdminRouter from "./Routers/Admin/AdminRouter";
import PhysicsRouter from "./Routers/Physics/PhysicsRouter";
import ExternRouter from "./Routers/Extern/ExternRouter";
import CallbackRouter from "./Routers/Callback/CallbackRouter";

import { TokenCheck } from "./Middlewares/AuthCheck";
import ClientErrorHandler from "./Middlewares/ClientErrorHandler";
import ErrorHandler from "./Middlewares/ErrorHandler";

expressApp.use("/extern", ExternRouter());
expressApp.use("/callback", CallbackRouter());
expressApp.use(TokenCheck);
expressApp.use("/admin", AdminRouter());
expressApp.use("/physics", PhysicsRouter());
expressApp.use(ClientErrorHandler);
expressApp.use(ErrorHandler);

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
async function main() {
	await mongoConnect();
	logger.info(`ENVIRONMENT : ${process.env.NODE_ENV}`);

	expressApp.listen(process.env.BRIDGE_PORT, async () => {
		logger.info(`listening on port ${process.env.BRIDGE_PORT}`);
		await refreshToken();
	});

	logger.info("=== SMTP connection TEST ===");

	// verify connection configuration
	await Mail.verify((error : Error | null, success : any) => {
		if (error) {
			logger.info(error);
		} else {
			logger.info("Success, Server is ready to send emails");
		}
	});
}

main();
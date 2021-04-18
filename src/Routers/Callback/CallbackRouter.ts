import * as CallbackRoutesMethods from "./CallbackRoutesMethods";
import * as express from 'express';

export default () => {
	const router = express.Router();

	/* GET */

	/* POST */
	router.post("/login", CallbackRoutesMethods.login);
	router.post("/register", CallbackRoutesMethods.signin);
	router.post("/reset", CallbackRoutesMethods.reset);

	/* PUT */

	/* DELETE */

	return router;
};

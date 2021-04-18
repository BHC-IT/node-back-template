import * as AdminRoutesMethods from "./AdminRoutesMethods";
import * as express from 'express';

export default () => {
	const router = express.Router();

	/* GET */
	router.get('/user', AdminRoutesMethods.getUserInfo);
	router.get('/history', AdminRoutesMethods.getHistoryOfUser);
	router.get('/code', AdminRoutesMethods.createCode);

	/* POST */
	// router.post('/register', AdminRoutesMethods.register);
	router.post('/code', AdminRoutesMethods.activateUserWithCode);

	/* PUT */

	/* DELETE */

	return router;
};

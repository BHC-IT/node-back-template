import { calculValidationRules, validateCalcul } from '../../Middlewares/Physics/RunValidator';
import * as express from 'express';
import * as PhysicsRoutesMethodes from "./PhysicsRoutesMethods";


export default () => {
	const router = express.Router();

	/* GET */
	router.get('/walls', PhysicsRoutesMethodes.getWallList);
	router.get('/rn', PhysicsRoutesMethodes.getRNList);
	router.get('/coef', PhysicsRoutesMethodes.getCoefList);

	/* POST */
	router.post('/run', calculValidationRules, validateCalcul, PhysicsRoutesMethodes.run);

	/* PUT */

	/* DELETE */

	return router;
};

import { TokenCheck } from "../../Middlewares/AuthCheck";
import { createStripeSessionRules, getStripeSessionRules, validateStripeSession } from "../../Middlewares/Extern/StripeValidator";
import * as ExternRoutesMethods from "./ExternRoutesMethods";
import * as express from 'express';

export default () => {
	const router = express.Router();
	/* GET */
	router.get("/stripe/checkout-session",
		TokenCheck,
		getStripeSessionRules,
		validateStripeSession,
		ExternRoutesMethods.getCheckoutSession
	);

	/* POST */
	router.post("/stripe/create-checkout-session",
		TokenCheck,
		createStripeSessionRules,
		validateStripeSession,
		ExternRoutesMethods.createCheckoutSession
	);
	router.post("/stripe/create-portal-session", TokenCheck, ExternRoutesMethods.createPortalSession)
	router.post("/stripe/webhook", ExternRoutesMethods.webHook)
	// router.post("/test", TokenCheck, ExternRoutesMethods.test)

	/* PUT */

	/* DELETE */

	return router;
};

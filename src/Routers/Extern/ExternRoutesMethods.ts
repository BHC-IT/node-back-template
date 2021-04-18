import InternalServerError from "../../Errors/InternalErrors";
import { BadRequestError } from "../../Errors/RequestErrors";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { Request, Response } from 'express'

import { User } from "../../Model/user";
import UserMongoose from "../../Schemas/user.schema";

import { ResponseType } from '../../Types/responseTypes'


/////////////////////
/// STRIPE
/////////////////////
export async function createCheckoutSession(req : Request, res : Response, next : any) {
	const { priceId } = req.body;
	// See https://stripe.com/docs/api/checkout/sessions/create
	// for additional parameters to pass.
	try {
		const customerId = await getStripeCustomer(req.body.user.username);
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			payment_method_types: ["card"],
			line_items: [
				{
					price: priceId,
					// For metered billing, do not pass quantity
					quantity: 1,
				},
			],
			customer: customerId,
			client_reference_id: req.body.user.id,
			// {CHECKOUT_SESSION_ID} is a string literal; do not change it!
			// the actual Session ID is returned in the query parameter when your customer
			// is redirected to the success page.
			success_url: `${process.env.DASHBOARD_URL}/Success`,
			cancel_url: `${process.env.DASHBOARD_URL}/Error`,
		});
		return res.bridgeResponse(ResponseType.STRIPE_SESSION_CREATED({sessionId: session.id}));
	} catch (error) {
		next(new BadRequestError("Failed to create stripe checkout session, provided priceId might be wrong.", error));
	}
}

export async function getCheckoutSession(req : Request, res : Response) {
	try {
		const session = await stripe.checkout.sessions.retrieve(req.body.sessionId);
		return res.bridgeResponse(ResponseType.STRIPE_SESSION(session));
	}
	catch (error) {
		console.error(error);
		throw new InternalServerError("Failed to retrieve stripe checkout session", error);
	}
}

export async function createPortalSession(req : Request, res : Response) {
	// For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
	// Typically this is stored alongside the authenticated user in your database.
	const { sessionId } = req.body;
	const checkoutsession = await stripe.checkout.sessions.retrieve(sessionId);

	// This is the url to which the customer will be redirected when they are done
	// managign their billing with the portal.
	const returnUrl = "http://dosismart.com/";

	const portalsession = await stripe.billingPortal.sessions.create({
		customer: checkoutsession.customer,
		return_url: returnUrl,
	});
	return res.bridgeResponse(ResponseType.STRIPE_PORTAL_SESSION({url: portalsession.url}));
}

export async function webHook(req : Request, res : Response) {
	let eventType;
	// Check if webhook signing is configured.
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	let data : any;
	let event : any;
	if (webhookSecret) {
		// Retrieve the event by verifying the signature using the raw body and secret.
		let signature = req.headers["stripe-signature"];

		try {
			event = stripe.webhooks.constructEvent(
				req.rawBody,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`);
			return res.bridgeResponse(ResponseType.BAD_REQUEST);
		}
		// Extract the object from the event.
		data = event.data;
		eventType = event.type;
	} else {
		// Webhook signing is recommended, but if the secret is not configured in `config.js`,
		// retrieve the event data directly from the request body.
		data = req.body.data;
		eventType = req.body.type;
	}
	console.log("eventType :", eventType);
	let userObj = await UserMongoose.find({email: data.object.customer_email})
	const user = new User(userObj[0]._id);
	switch (event.type) {
		case 'checkout.session.completed':
			// Payment is successful and the subscription is created.
			// You should provision the subscription.
			console.log("TEST : checkout.session.completed");
			await user.addSubsciptionForXMonth(1);
			console.log("user :", user);
		break;
		case 'invoice.paid':
			// Continue to provision the subscription as payments continue to be made.
			// Store the status in your database and check when a user accesses your service.
			// This approach helps you avoid hitting rate limits.
			console.log("TEST : invoice.paid");
			await user.addSubsciptionForXMonth(1);
			console.log("user :", user);
		break;
		case 'invoice.payment_failed':
			// The payment failed or the customer does not have a valid payment method.
			// The subscription becomes past_due. Notify your customer and send them to the
			// customer portal to update their payment information.
			console.log("TEST : invoice.payment_failed");
		break;
		default:
			// Unhandled event type
	}
	return res.bridgeResponse(ResponseType.OK);
}

async function getStripeCustomer(email : string) : Promise<string> {
	const customers = await stripe.customers.list({
		email: email,
	});
	let customer = customers.data[0] ? customers.data[0] : await stripe.customers.create({email: email});
	return customer.id;
}

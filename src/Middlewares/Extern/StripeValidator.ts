import { BadRequestError } from "../../Errors/RequestErrors";
import { body, query, validationResult } from "express-validator";
import { Request, Response } from 'express'

export const createStripeSessionRules = [
    body("priceId").exists().withMessage("Missing priceId"),
];

export const getStripeSessionRules = [
    query("sessionId").exists().withMessage("Missing sessionId"),
]

export function validateStripeSession(req : Request, res : Response, next : Function) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err : any) => extractedErrors.push({ [err.param]: err.msg }));

      return next(new BadRequestError(errors.array()));
    }
    req.body.sessionId = req.query.sessionId;
    return next();
}

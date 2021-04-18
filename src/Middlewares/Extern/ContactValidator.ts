import { BadRequestError } from "../../Errors/RequestErrors";
import { body, validationResult } from "express-validator";
import { Request, Response } from 'express'

export const contactValidationRules = [
  body("name").exists().withMessage("Missing parameter name"),
  body("email").exists().withMessage("Missing parameter email").isEmail().withMessage("Invalid email format"),
  body("job").exists().withMessage("Missing parameter job"),
  body("message").exists().withMessage("Missing parameter message"),
  body("newsletter")
    .exists()
    .withMessage("Missing parameter newsletter")
    .isBoolean()
    .withMessage("Invalid newsletter format, expected a boolean")
    .toBoolean(),
  body("beta")
    .exists()
    .withMessage("Missing parameter beta")
    .isBoolean()
    .withMessage("Invalid beta format, expected a boolean")
    .toBoolean()
];

export function validateContact(req : Request, res : Response, next : Function) {
  let contactInfo = null;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    contactInfo = {
      name: req.body.name,
      email: req.body.email,
      job: req.body.job,
      message: req.body.message,
      newsletter: !(req.body.newsletter === "false" || req.body.newsletter === "0"),
      beta: !(req.body.beta === "false" || req.body.beta === "0")
    };

    // Check if email is already registered
    // mongo.col("contacts").findOne({ email: contactInfo.email }, (err : Error, res : any) => {
    //   if (err !== null) {
    //     return next(new InternalServerError("Failed to check contact info", err));
    //   }
    //   if (res !== null) {
    //     return next(new ConflictRequestError("Email contact is already registered"));
    //   }
    // });

    req.body.contactInfo = contactInfo;

    return next();
  }

  const extractedErrors = [];
  errors.array().map((err : any) => extractedErrors.push({ [err.param]: err.msg }));

  // TODO: better bad param error message
  return next(new BadRequestError(errors.array()));
}
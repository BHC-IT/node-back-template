import { BadRequestError } from "../../Errors/RequestErrors";
import { body, validationResult } from "express-validator";
import { Request, Response } from 'express'

export const calculValidationRules = [
  body("rn")
    .exists()
    .withMessage("Missing parameter rn")
    .isString()
    .withMessage("Invalid rn format, expected an integer"),
  body("activity")
    .exists()
    .withMessage("Missing parameter activity")
    .isFloat()
    .withMessage("Invalid activity format, expected a float")
    .toFloat(),
  body("distance")
    .exists()
    .withMessage("Missing parameter distance")
    .isFloat()
    .withMessage("Invalid distance format, expected a float")
    .toFloat(),
  body("walls")
    .optional()
    // not usefull as the body is already parsed by JSON.parse(), leading to walls field beeing already of type array
    // .customSanitizer(value => {
    //   try {
    //     return JSON.parse(value);
    //   } catch (error) {
    //     return new Error('Invalid walls format, expected an array');
    //   }
    // })
    .isArray()
    .withMessage("Invalid walls format, expected an array"),
  body("walls.*.materialID")
    .exists()
    .withMessage("One of the walls is missing the materialID value")
    .isString()
    .withMessage("Expected an integer for materialID value"),
  body("walls.*.thickness")
    .exists()
    .withMessage("One of the walls is missing the thickness value")
    .isFloat()
    .withMessage("Expected a float for thickness value")
    .toFloat(),
  body("iso").exists().withMessage("ISO not specified").isString().withMessage("Expected an int for ISO value"),
  body("coef")
    .exists()
    .withMessage("Missing parameter coef")
    .isString()
    .withMessage("Expected a string for coef value"),
    body("multiplyer.activity")
    .optional()
    .isFloat()
    .withMessage("Expected a number for multiplyer.activity value"),
    body("multiplyer.distance")
    .optional()
    .isFloat()
    .withMessage("Expected a number for multiplyer.distance value"),
    body("multiplyer.thickness")
    .optional()
    .isArray()
    .withMessage("Expected an array for multiplyer.thickness value"),
];

export function validateCalcul(req : Request, res : Response, next : Function) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    // TODO: better bad param error message
    return next(new BadRequestError(errors.array()));
  }
  return next();
}
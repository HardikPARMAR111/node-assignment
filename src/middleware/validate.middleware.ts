import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { resolveTlsa } from "dns";
import { NextFunction, Request, Response } from "express";

// validation middleware
export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        errors: Object.values(err.constraints!),
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    next();
  };
};

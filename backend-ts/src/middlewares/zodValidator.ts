import * as z from 'zod'
import { type ZodTypeAny } from 'zod/v3';
import { type RequestHandler } from "express";

type Location = "body" | "params" | "query";

export function validateSchema<T extends ZodTypeAny>(schema: T, loc: Location = "body"): RequestHandler {

    return (req, res, next) => {
        const payload = loc === "body" ? req.body : (loc == 'params' ? req.params : req.query)

        const result = schema.safeParse(payload)

        if(!result.success) {

            let issues = result.error.issues.map(issue => (
                {
                    message: issue.message,
                    path: issue.path
                }
            ))

            // 422 for validation errors
            return res.status(422).json({
                error: "validation error",
                issues
            })
        }

        if (loc === 'body') req.body = result.data
        if (loc === 'params') req.params = result.data
        if (loc === "query") req.query = result.data

        next();
    }

}
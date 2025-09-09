import * as z from 'zod'
import { type ZodTypeAny } from 'zod/v3';
import { type RequestHandler } from "express";

type Location = "body" | "params" | "query";

export function validateSchema<T extends ZodTypeAny>(schema: T, loc: Location = "body"): RequestHandler {

    return async (req, res, next) => {
        try {
            const payload = loc === "body" ? req.body : (loc === 'params' ? req.params : req.query)
    
            const result = await schema.safeParseAsync(payload)
    
            if(!result.success) {
    
                let issues = result.error.issues.map(issue => (
                    {
                        message: issue.message,
                        path: issue.path
                    }
                ))
    
                // 422 for validation errors
                return res.status(422).json({
                    success: 'false',
                    error: "validation error",
                    issues
                })
            }
    
            res.locals.validated = res.locals.validated ?? {}
    
            if (loc === 'body') res.locals.validated.body = result.data
            if (loc === 'params') res.locals.validated.params = result.data
            if (loc === "query") res.locals.validated.query = result.data
    
            next();
        } catch (error) {
            next(error)
        }
    }

}
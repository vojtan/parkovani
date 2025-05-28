import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from "zod";

export function withValidation<T>(handler: (req: HttpRequest, ctx: InvocationContext, data: T) => Promise<HttpResponseInit>, schema: z.ZodSchema<T>) {
    return async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
        const body = await req.json();
        const parsedObject =  schema.safeParse(body); 
        if (!parsedObject.success) {
            return {
                status: 400,
                body: JSON.stringify({
                    error: 'Validation failed',
                    details: parsedObject.error.errors
                })
            };
        }
        return handler(req, ctx, parsedObject.data);
    };
}

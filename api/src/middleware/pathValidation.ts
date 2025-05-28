import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export interface PathValidationRules {
    [key: string]: 'required' | 'integer' | 'string';
}

export function withPathValidation(
    handler: (req: HttpRequest, ctx: InvocationContext) => Promise<HttpResponseInit>,
    rules: PathValidationRules
) {
    return async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
        for (const [paramName, rule] of Object.entries(rules)) {
            const value = req.params[paramName];
            
            if (rule === 'required' && !value) {
                return {
                    status: 400,
                    body: JSON.stringify({
                        error: `${paramName} is required`,
                    }),
                };
            }
            
            if (rule === 'integer' && value) {
                const parsed = parseInt(value);
                if (isNaN(parsed) || parsed.toString() !== value) {
                    return {
                        status: 400,
                        body: JSON.stringify({
                            error: `${paramName} must be an integer number`,
                        }),
                    };
                }
            }
        }
        
        return handler(req, ctx);
    };
}

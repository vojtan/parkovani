import { HttpResponseInit, InvocationContext } from "@azure/functions";
import { ConfigurationError } from "../errors";

export function handleError(error: any, context: InvocationContext, defaultMessage: string = "An error occurred"): HttpResponseInit {
    context.log('Error:', error);
    
    if (error instanceof ConfigurationError) {
        return {
            status: 500,
            body: JSON.stringify({
                error: "Configuration error: " + error.message,
            }),
        };
    }
    
    return {
        status: 500,
        body: JSON.stringify({
            error: error.message || defaultMessage,
        }),
    };
}

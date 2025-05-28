import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PermitService } from "../services/permitService";
import { ConfigurationError } from "../errors";

export async function permits(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const carRegistration = request.query.get('carRegistration');
        const items = await PermitService.getPermits(carRegistration);
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        };
    } catch (error) {
        context.log('Error retrieving permits:', error);
        if (error instanceof ConfigurationError) {
            return {
                status: 500,
                body: JSON.stringify({
                    error: 'Configuration error: ' + error.message
                })
            };
        }
        
        return {
            status: 500,
            body: JSON.stringify({
                 error
            })
        };
    }
};

app.http('getPermits', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'permits',
    handler: permits
});

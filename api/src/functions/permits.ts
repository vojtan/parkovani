import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleError } from "../utils/errorHandler";
import { DIContainer } from "../di/container";
import { IPermitRepository } from "../interfaces/IPermitRepository";
import { TYPES } from "../di/types";

export async function permits(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
                const container = DIContainer.getContainer();
        const permitRepository = container.get<IPermitRepository>(TYPES.PermitRepository);


        const carRegistration = request.query.get('carRegistration');
        const items = await permitRepository.getPermits(carRegistration);
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        };
    } catch (error) {
        return handleError(error, context, "An error occurred while retrieving permits");
    }
};

app.http('getPermits', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'permits',
    handler: permits
});

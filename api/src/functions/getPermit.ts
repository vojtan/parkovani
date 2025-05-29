import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { DIContainer } from "../di/container";
import { TYPES } from "../di/types";
import { handleError } from "../utils/errorHandler";
import { withPathValidation } from "../middleware/pathValidation";
import { IPermitRepository } from "../interfaces/IPermitRepository";

export async function getPermit(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    try {
        const id = parseInt(request.params.id);
        const container = DIContainer.getContainer();
        const permitRepository = container.get<IPermitRepository>(TYPES.PermitRepository);
        const permit = await permitRepository.getPermitById(id);
        
        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(permit),
        };
    } catch (error) {
        return handleError(error, context, "An error occurred while retrieving the permit");
    }
}

app.http("getPermit", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "permits/{id}",
    handler: withPathValidation(getPermit, { id: 'integer' }),
});

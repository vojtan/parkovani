import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { PermitService } from "../services/permitService";
import { handleError } from "../utils/errorHandler";
import { withPathValidation } from "../middleware/pathValidation";

export async function getPermit(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    try {
        const id = parseInt(request.params.id);
        const permit = await PermitService.getPermitById(id);
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

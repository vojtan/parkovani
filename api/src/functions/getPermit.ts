import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { PermitService } from "../services/permitService";
import { handleError } from "../utils/errorHandler";

export async function getPermit(
    request: HttpRequest,
    context: InvocationContext,
): Promise<HttpResponseInit> {
    try {
        const permit = await PermitService.getPermitById(request.params.id);
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
    handler: getPermit,
});

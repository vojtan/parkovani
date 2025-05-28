import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { PermitService } from "../services/permitService";
import { ConfigurationError } from "../errors";

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
        context.log("Error getting permit:", error);
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
                error:
                    error.message ||
                    "An error occurred while retrieving the permit",
            }),
        };
    }
}

app.http("getPermit", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "permits/{id}",
    handler: getPermit,
});

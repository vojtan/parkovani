import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { PermitData, PermitSchema } from "../schemas/permitSchema";
import { withValidation } from "../middleware/validation";
import { PermitService } from "../services/permitService";
import { ConfigurationError } from "../errors";

export async function addPermit(
    request: HttpRequest,
    context: InvocationContext,
    permitData: PermitData
): Promise<HttpResponseInit> {
    try {
        const response = await PermitService.addPermit(permitData);
        return {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Permit added successfully",
                id: response.id,
            }),
        };
    } catch (error) {
        if (error instanceof ConfigurationError)
        {
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
                    "An error occurred while adding the permit",
            }),
        };
    }
}

app.http("addPermit", {
    methods: ["PUT"],
    authLevel: "anonymous",
    route: "permits",
    handler: withValidation(addPermit, PermitSchema),
});

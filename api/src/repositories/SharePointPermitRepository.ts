import { injectable } from "inversify";
const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
    TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

import { IPermitRepository } from "../interfaces/IPermitRepository";
import { ConfigurationError } from "../errors";
import { AddPermitRequest, PermitResponse } from "../schemas/permitSchema";

@injectable()
export class SharePointPermitRepository implements IPermitRepository {
    private readonly tenantId: string;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly siteId: string;
    private readonly listId: string;

    constructor() {
        // Validate required environment variables
        this.tenantId = process.env.TENANT_ID!;
        this.clientId = process.env.CLIENT_ID!;
        this.clientSecret = process.env.CLIENT_SECRET!;
        this.siteId = process.env.SITE_ID!;
        this.listId = process.env.LIST_ID!;

        if (
            !this.tenantId ||
            !this.clientId ||
            !this.clientSecret ||
            !this.siteId ||
            !this.listId
        ) {
            throw new ConfigurationError(
                "SharePoint configuration incomplete. Check environment variables: TENANT_ID, CLIENT_ID, CLIENT_SECRET, SITE_ID, LIST_ID",
            );
        }
    }

    /**
     * Creates and configures Microsoft Graph client with authentication
     * @returns Configured Graph client instance
     */
    private async getGraphClient() {
        try {
            const credential = new ClientSecretCredential(
                this.tenantId,
                this.clientId,
                this.clientSecret,
            );

            const authProvider = new TokenCredentialAuthenticationProvider(
                credential,
                {
                    scopes: ["https://graph.microsoft.com/.default"],
                },
            );

            return Client.initWithMiddleware({
                authProvider: authProvider,
            });
        } catch (error) {
            throw new ConfigurationError(
                `Failed to initialize Graph client: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    /**
     * Maps SharePoint list item to PermitDto
     * @param item - SharePoint list item response
     * @returns Mapped PermitDto object
     */
    private mapToPermitDto(item: any): PermitResponse {
        return {
            id: item.id,
            validFrom: item.fields.validFrom,
            price: item.fields.price,
            status: item.fields.status,
            variableSymbol: item.fields.variableSymbol,
            userId: item.fields.userid,
            firstName: item.fields.firstName || null,
            lastName: item.fields.lastName || null,
            email: item.fields.email || null,
            city: item.fields.city || null,
            street: item.fields.street || null,
            houseNumber: item.fields.houseNumber || null,
            permitDuration: item.fields.permitDuration || null,
            paymentMethod: item.fields.paymentMethod || null,
            carRegistration: item.fields.carRegistration || null,
            zones: item.fields.zones || null,
        };
    }

    async getPermitById(permitId: number): Promise<PermitResponse | null> {
        try {
            const graphClient = await this.getGraphClient();

            const response = await graphClient
                .api(
                    `/sites/${this.siteId}/lists/${this.listId}/items/${permitId}?expand=fields`,
                )
                .get();

            return this.mapToPermitDto(response);
        } catch (error) {
            if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "itemNotFound"
            ) {
                return null;
            }
            throw new Error(
                `Failed to retrieve permit ${permitId}: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async addPermit(
        permitData: Partial<AddPermitRequest>,
    ): Promise<{ id: number }> {
        const calculateEndDate = (
            start?: Date,
            permitDuration?: "quarter" | "year",
        ): Date => {
            if (!start) return null;
            let result = new Date(start);
            if (permitDuration === "quarter") {
                result.setMonth(result.getMonth() + 3);
            } else if (permitDuration === "year") {
                result.setFullYear(result.getFullYear() + 1);
            }
            return result;
        };

        try {
            const itemFields = {
                validFrom: permitData.validFrom.toISOString(),
                validTo: calculateEndDate(
                    permitData.validFrom,
                    permitData.permitDuration,
                ).toISOString(),
                price: permitData.price,
                firstName: permitData.firstName || null,
                lastName: permitData.lastName || null,
                "zones@odata.type": "Collection(Edm.String)",
                "zones": [ "Podmokly" ],
                email: permitData.email || null,
                city: permitData.city || null,
                street: permitData.street || null,
                houseNumber: permitData.houseNumber || null,
                permitDuration: permitData.permitDuration || null,
                paymentMethod: permitData.paymentMethod || null,
                carRegistration: permitData.carRegistration || null,
                userId: permitData.userId || null,
            };

            const graphClient = await this.getGraphClient();

            const result = await graphClient
                .api(`/sites/${this.siteId}/lists/${this.listId}/items`)
                .post({
                    fields: itemFields,
                });

            return { id: result.id };
        } catch (error) {
            throw new Error(
                `Failed to add permit: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async getPermits(carRegistration?: string): Promise<PermitResponse[]> {
        try {
            const graphClient = await this.getGraphClient();

            let apiRequest = graphClient
                .api(`/sites/${this.siteId}/lists/${this.listId}/items`)
                .expand("fields");

            if (carRegistration) {
                apiRequest = apiRequest.filter(
                    `fields/carRegistration eq '${carRegistration}'`,
                );
            }

            const response = await apiRequest.get();

            return response.value.map((item: any) => this.mapToPermitDto(item));
        } catch (error) {
            throw new Error(
                `Failed to retrieve permits: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }
}

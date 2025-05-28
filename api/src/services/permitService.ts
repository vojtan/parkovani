const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
    TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
import { ConfigurationError } from "../errors";
import { AddPermitDto, PermitDto } from "../types/permit";

export class PermitService {
    static tenantId = process.env.TENANT_ID;
    static clientId = process.env.CLIENT_ID;
    static clientSecret = process.env.CLIENT_SECRET;
    static siteId = process.env.SITE_ID;
    static listId = process.env.LIST_ID;

    private static async getGraphClient() {
        if (
            !PermitService.tenantId ||
            !PermitService.clientId ||
            !PermitService.clientSecret ||
            !PermitService.siteId ||
            !PermitService.listId
        ) {
            throw new ConfigurationError(
                "Graph client is not initialized. Check environment variables.",
            );
        }

        const credential = new ClientSecretCredential(
            PermitService.tenantId,
            PermitService.clientId,
            PermitService.clientSecret,
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
    }

    public static async getPermitById(permitId: string): Promise<PermitDto | null> {
        const graphClient = await PermitService.getGraphClient();
      
        const response = await graphClient
            .api(
                `/sites/${PermitService.siteId}/lists/${PermitService.listId}/items/${permitId}?expand=fields`,
            )
            .get();
        
        return {
            id: response.id,
            validFrom: response.fields.validFrom,
            validTo: response.fields.validTo,
            price: response.fields.price,
            status: response.fields.status,
            variableSymbol: response.fields.variableSymbol,
            userId: response.fields.userid,
            firstName: response.fields.firstName || null,
            lastName: response.fields.lastName || null,
            email: response.fields.email || null,
            city: response.fields.city || null,
            street: response.fields.street || null,
            houseNumber: response.fields.houseNumber || null,
            permitDuration: response.fields.permitDuration || null,
            paymentMethod: response.fields.paymentMethod || null,
            carRegistration: response.fields.carRegistration || null,
            zones: response.fields.zones || null,
        };
    }

    public static async addPermit(
        permitData: Partial<AddPermitDto>,
    ): Promise<{ id: number }> {
        const itemFields = {
            validFrom: permitData.validFrom,
            validTo: permitData.validTo,
            price: permitData.price,
            firstName: permitData.firstName || null,
            lastName: permitData.lastName || null,
            email: permitData.email || null,
            city: permitData.city || null,
            street: permitData.street || null,
            houseNumber: permitData.houseNumber || null,
            permitDuration: permitData.permitDuration || null,
            paymentMethod: permitData.paymentMethod || null,
            carRegistration: permitData.carRegistration || null,
            userId: permitData.userId || null,
            zones: permitData.zones || null,
        };
        const graphClient = await PermitService.getGraphClient();
        if (!graphClient) {
            throw new Error(
                "Graph client is not initialized. Check environment variables.",
            );
        }
        return await graphClient
            .api(
                `/sites/${PermitService.siteId}/lists/${PermitService.listId}/items`,
            )
            .post({
                fields: itemFields,
            });
    }
    public static async getPermits(carRegistration?: string): Promise<PermitDto[]> {
          const graphClient = await PermitService.getGraphClient();
        
                // Prepare filter if carRegistration is present
                let apiRequest = graphClient
                    .api(`/sites/${PermitService.siteId}/lists/${PermitService.listId}/items`)
                    .expand('fields');
        
                if (carRegistration) {
                    apiRequest = apiRequest.filter(`fields/carRegistration eq '${carRegistration}'`);
                }
                const response = await apiRequest.get();
        
                // Extract relevant data from the response
                return response.value.map(item => {
                    return item.fields;
                });
        
    }
}

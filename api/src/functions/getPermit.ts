import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

export async function getPermit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Get configuration values from environment variables
        const tenantId = process.env.TENANT_ID;
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const siteId = process.env.SITE_ID;
        const listId = process.env.LIST_ID;
        
        if (!tenantId || !clientId || !clientSecret || !siteId || !listId) {
            return {
                status: 500,
                body: JSON.stringify({
                    error: 'Missing required environment variables'
                })
            };
        }

        // Get the permit ID from the URL parameter
        const permitId = request.params.id;
        
        if (!permitId) {
            return {
                status: 400,
                body: JSON.stringify({
                    error: 'Missing permit ID'
                })
            };
        }

        // Set up the authentication provider using client credentials
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ['https://graph.microsoft.com/.default']
        });

        // Initialize the Microsoft Graph client
        const graphClient = Client.initWithMiddleware({
            authProvider: authProvider
        });

        // Get the item from the SharePoint list
        const response = await graphClient
            .api(`/sites/${siteId}/lists/${listId}/items/${permitId}?expand=fields`)
            .get();

        // Extract the relevant fields from the response
        const permit = {
            id: response.id,
            validFrom: response.fields.validFrom,
            validTo: response.fields.validTo,
            price: response.fields.price,
            status: response.fields.status,
            variableSymbol: response.fields.variablesymbol,
        };

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(permit)
        };
    } catch (error) {
        context.log('Error getting permit:', error);
        
        return {
            status: 500,
            body: JSON.stringify({
                error: error.message || 'An error occurred while retrieving the permit'
            })
        };
    }
}

app.http('getPermit', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'permits/{id}',
    handler: getPermit
});

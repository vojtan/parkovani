import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');


export async function permits(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        // Set up the authentication provider using client credentials
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ['https://graph.microsoft.com/.default']
        });

        // Initialize the Microsoft Graph client
        const graphClient = Client.initWithMiddleware({
            authProvider: authProvider
        });

        // Prepare filter if carRegistration is present
        let apiRequest = graphClient
            .api(`/sites/${siteId}/lists/${listId}/items`)
            .expand('fields');

        const carRegistration =  request.query.get('carRegistration');
        if (carRegistration) {
            // Use OData filter for carRegistration field (case-insensitive)
            apiRequest = apiRequest.filter(`fields/carregistration eq '${carRegistration}'`);
        }

        // Get list items
        const response = await apiRequest.get();

        // Extract relevant data from the response
        const items = response.value.map(item => {
            return item.fields;
        });

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        };
    } catch (error) {
        
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

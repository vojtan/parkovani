import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

export async function addPermit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        // Parse the request body
        const permitData = await request.json() as any;
        
        // Validate required fields
        const requiredFields = ['validFrom', 'validTo', 'price'];
        for (const field of requiredFields) {
            if (!permitData[field]) {
                return {
                    status: 400,
                    body: JSON.stringify({
                        error: `Missing required field: ${field}`
                    })
                };
            }
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

        // Prepare the fields for the new item
        const itemFields = {
            validFrom: permitData.validFrom,
            validTo: permitData.validTo,
            price: permitData.price
        };

        // Create a new item in the SharePoint list
        const response = await graphClient
            .api(`/sites/${siteId}/lists/${listId}/items`)
            .post({
                fields: itemFields
            });

        return {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Permit added successfully',
                id: response.id
            })
        };
    } catch (error) {
        context.log('Error adding permit:', error);
        
        return {
            status: 500,
            body: JSON.stringify({
                error: error.message || 'An error occurred while adding the permit'
            })
        };
    }
}

app.http('addPermit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'permits',
    handler: addPermit
});

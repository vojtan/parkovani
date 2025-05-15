// import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// const { ClientSecretCredential } = require('@azure/identity');
// const { Client } = require('@microsoft/microsoft-graph-client');
// const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

// export async function updatePermit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//     try {
//         // Get configuration values from environment variables
//         const tenantId = process.env.TENANT_ID;
//         const clientId = process.env.CLIENT_ID;
//         const clientSecret = process.env.CLIENT_SECRET;
//         const siteId = process.env.SITE_ID;
//         const listId = process.env.LIST_ID;

//         if (!tenantId || !clientId || !clientSecret || !siteId || !listId) {
//             return {
//                 status: 500,
//                 body: JSON.stringify({
//                     error: 'Missing required environment variables'
//                 })
//             };
//         }

//         // Parse the request body
//         const id = request.params.id;
//         const body = await request.json() as any;
//         const { carRegistration } = body;

//         // Validate required fields
//         if (!id) {
//             return {
//                 status: 400,
//                 body: JSON.stringify({
//                     error: 'Missing required field: id'
//                 })
//             };
//         }
//         if (!carRegistration) {
//             return {
//                 status: 400,
//                 body: JSON.stringify({
//                     error: 'Missing required field: carRegistration'
//                 })
//             };
//         }

//         // Set up the authentication provider using client credentials
//         const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
//         const authProvider = new TokenCredentialAuthenticationProvider(credential, {
//             scopes: ['https://graph.microsoft.com/.default']
//         });

//         // Initialize the Microsoft Graph client
//         const graphClient = Client.initWithMiddleware({
//             authProvider: authProvider
//         });

//         // Prepare the fields to update
//         const updateFields = {
//             carregistration: carRegistration
//         };

//         // Update the item in the SharePoint list
//         await graphClient
//             .api(`/sites/${siteId}/lists/${listId}/items/${id}/fields`)
//             .patch(updateFields);

//         return {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 message: 'Permit updated successfully',
//                 id: id
//             })
//         };
//     } catch (error) {
//         context.log('Error updating permit:', error);

//         return {
//             status: 500,
//             body: JSON.stringify({
//                 error: error.message || 'An error occurred while updating the permit'
//             })
//         };
//     }
// }

// app.http('updatePermit', {
//     methods: ['POST'],
//     authLevel: 'anonymous',
//     route: 'permits/{id}',
//     handler: updatePermit
// });
// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '95vn7fij69'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/develop`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-3xobn2786ug4wj1d.us.auth0.com',            // Auth0 domain
  clientId: 'v6HBODvy5LL0XkjMc1rzWYzQDqAYS5Q0',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

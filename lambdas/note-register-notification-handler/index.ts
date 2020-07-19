import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const registrations = new DynamoSlim('notification-registrations', new DynamoDB({apiVersion: '2012-08-10'}));
const tenants = new DynamoSlim('tenants', new DynamoDB({apiVersion: '2012-08-10'}));
const getTenant = async(event: any) => {
  const currentTenant = await tenants.get({
    username: event.requestContext.authorizer.claims.username
  });
  return currentTenant?.tenantId
}
const getUsername = (event: any) => {
  return event.requestContext.authorizer.claims.username
}

module.exports.handler = new LambdaHandler({
  method: 'post',
  project: 'NoteTaker',
  url: '/fcm-tokens',
  version: '1.0',
  gen: true
}).allowOrigins([200, 500], '*')
.setsHeaders([200, 500, 404], {
  'access-control-allow-origin': "*"
})
.respondsWithJsonObject(200, b => b.withBoolean('success'))
.respondsWithJsonObject(500, b => b.withString('message'))
.processesEventWith(async(event, _) => {
  try {
    const tenantId = await getTenant(event);
    if (!tenantId) {
      throw new Error(`tenant not found`);
    }
    const username = getUsername(event);

    const {token} = event.body as {token: string};
    if (!token) {
      throw new Error('missing token param');
    }
    const element = await registrations.get({ token }) || {
      token,
      username,
      tenantId,
      createdAt: Date.now()
    };
    await registrations.save([element]);
    return {
      statusCode: 200,
      body: {
        success: true
      }
    } as const
  } catch (e) {
    return {
      statusCode: 500,
      body: {
        message: e.message
      }
    } as const
  }
})
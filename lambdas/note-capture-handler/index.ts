import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const notes = new DynamoSlim('notes', new DynamoDB({apiVersion: '2012-08-10'}));
const recentNotes = new DynamoSlim('recentNotes', new DynamoDB({apiVersion: '2012-08-10'}));
const recentNoteTTL = 72 * 60 * 60 * 1000;
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
  url: '/notes',
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
    const {note, name} = event.body as {note: any; name: string;};
    const valueToSave = JSON.stringify(note);
    if (!name) {
      throw new Error('missing name param');
    }
    if (valueToSave.length > 15000) {
      throw new Error('too much data ' + valueToSave.length + ' bytes');
    }
    if (valueToSave.length == 0) {
      throw new Error('blank document');
    }

    const element = await notes.get({ name: name, tenantId: tenantId }) || {
      name: name,
      tenantId: tenantId,
      values: [],
      createdBy: getUsername(event),
      createdAt: Date.now()
    };
    if (element.values.slice().reverse()[0]?.value == valueToSave) {
      return {
        statusCode: 200,
        body:{ success: true }
      } as const;
    }
    element.values = [{timestamp: Date.now(), value: valueToSave}]
    element.lastUpdatedBy = getUsername(event);
    element.lastUpdatedAt = Date.now();
    await Promise.all([
      notes.save([element]),
      recentNotes.save({
        name, tenantId, ttl: Date.now() + recentNoteTTL
      })
    ]);
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
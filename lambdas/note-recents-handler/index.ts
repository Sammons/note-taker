import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const recentNotes = new DynamoSlim('recent-notes', new DynamoDB({apiVersion: '2012-08-10'}));
const notes = new DynamoSlim('notes', new DynamoDB({apiVersion: '2012-08-10'}));

const tenants = new DynamoSlim('tenants', new DynamoDB({apiVersion: '2012-08-10'}));
const getTenant = async(event: any) => {
  const currentTenant = await tenants.get({
    username: event.requestContext.authorizer.claims.username
  });
  return currentTenant?.tenantId
}

module.exports.handler = new LambdaHandler({
  method: 'get',
  project: 'NoteTaker',
  url: '/recent-notes',
  version: '1.0',
  gen: true
}).allowOrigins([200, 500, 404], '*')
.setsHeaders([200, 500, 404], {
  'access-control-allow-origin': "*"
})
.respondsWithJsonObject(200, b => b.withArray('value', b => b.withItemType('object', m => m)))
.respondsWithJsonObject(500, b => b.withString('message'))
.processesEventWith(async(event, _) => {
  try {
    const tenantId = await getTenant(event);
    if (!tenantId) {
      throw new Error(`tenant not found`);
    }
    const recentNotesList: ({[key:string]: string}[]) | undefined = await recentNotes.getAll({
       tenantId: {
         op: '=', value: tenantId
       }
    })
    if (!recentNotesList) {
      return {
        statusCode: 200,
        body: {
          value: []
        }
      }
    }
    const mappedRecentNotes: {}[] = [];
    for (let element of recentNotesList) {
      if (element.id) {
        const note=  await notes.get({ id: element.id })
        if (note) {
          mappedRecentNotes.push(note)
        }
      }
    }

    return {
      statusCode: 200,
      body: {
        value: mappedRecentNotes as any[]
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
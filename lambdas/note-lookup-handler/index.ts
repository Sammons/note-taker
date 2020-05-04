import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const notes = new DynamoSlim('notes', new DynamoDB({apiVersion: '2012-08-10'}));

module.exports.handler = new LambdaHandler({
  method: 'get',
  project: 'NoteTaker',
  url: '/notes/:name',
  version: '1.0',
  gen: true
}).allowOrigins([200, 500, 404], '*')
.setsHeaders([200, 500, 404], {
  'access-control-allow-origin': "*"
})
.respondsWithJsonObject(200, b => b.withObject('value', b => b))
.respondsWithJsonObject(500, b => b.withString('message'))
.respondsWithJsonObject(404, b => b.withString('message'))
.processesEventWith(async(event, _) => {
  try {
    const name = (event.pathParameters as {[key: string]: any})['name'];
    if (!name) {
      throw new Error('missing name param');
    }
    const element = await notes.get({ name: name })
    if (!element) {
      return {
        statusCode: 404,
        body: {
          message: 'not found'
        }
      } as const;
    }
    return {
      statusCode: 200,
      body: {
        value: element as {}
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
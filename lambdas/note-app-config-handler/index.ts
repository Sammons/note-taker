import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const config = new DynamoSlim('note-app-config', new DynamoDB({apiVersion: '2012-08-10'}));

module.exports.handler = new LambdaHandler({
  method: 'get',
  project: 'NoteTaker',
  url: '/settings/:id',
  version: '1.0',
  gen: true
}).allowOrigins([200, 500, 404], '*')
.setsHeaders([200, 500, 404], {
  'access-control-allow-origin': "*"
})
.respondsWithJsonObject(200, b => b.withObject('value', b => b))
.respondsWithJsonObject(500, b => b.withString('message'))
.processesEventWith(async(event, _) => {
  try {
    const id = event.pathParameters
    ? (event.pathParameters as {[key: string]: any})['id']
    : 'global'
    const settings = await config.get({ settingName: id });
    return {
      statusCode: 200,
      body: {
        value: settings || {}
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
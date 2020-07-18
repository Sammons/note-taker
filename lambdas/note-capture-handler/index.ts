import { LambdaHandler, DynamoSlim } from 'lambda-toolkit-utilities'
import {DynamoDB} from 'aws-sdk';

const notes = new DynamoSlim('notes', new DynamoDB({apiVersion: '2012-08-10'}));

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
    const element = await notes.get({ name: name }) || {
      name: name,
      values: [],
      createdAt: Date.now()
    };
    if (element.values.slice().reverse()[0]?.value == valueToSave) {
      return {
        statusCode: 200,
        body:{ success: true }
      } as const;
    }
    element.values = [{timestamp: Date.now(), value: valueToSave}]
    await notes.save([element])
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
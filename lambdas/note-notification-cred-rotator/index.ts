import { DynamoSlim } from 'lambda-toolkit-utilities'
import { DynamoDB } from 'aws-sdk';

const config = new DynamoSlim('note-app-config', new DynamoDB({ apiVersion: '2012-08-10' }));
import * as gapis from 'googleapis';

type Event = {};
type Context = {};
/** refreshes the admin token */
module.exports.handler = async (event: Event, context: Context) => {
  try {
    const settings = await config.get({
      settingName: 'fcm_service_account'
    }) as {
      auth_provider_x509_cert_url: string;
      auth_uri: string;
      client_email: string;
      client_id: string;
      client_x509_cert_url: string;
      private_key: string;
      private_key_id: string;
      project_id: string;
      token_uri: string;
      type: string;
    } | undefined;
    if (!settings) {
      throw new Error(`Failed because there was no setting in the database`)
    }
    const client = new gapis.google.auth.JWT(
      settings.client_email,
      undefined,
      settings.private_key,
      [`https://www.googleapis.com/auth/firebase.messaging`]
    );
    const credentials = await client.authorize();
    
    await config.save([{
      ...credentials,
      settingName: 'fcm_notification_credentials'
    }])
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
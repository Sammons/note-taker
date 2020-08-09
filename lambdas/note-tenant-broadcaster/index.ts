import { DynamoSlim } from 'lambda-toolkit-utilities'
import { DynamoDB } from 'aws-sdk';

const config = new DynamoSlim('note-app-config', new DynamoDB({ apiVersion: '2012-08-10' }));
const registrydb = new DynamoSlim('notification-registrations', new DynamoDB({ apiVersion: '2012-08-10' }));

import * as gapis from 'googleapis';

type Event = {};
type Context = {};

/** refreshes the admin token */
module.exports.handler = async (event: Event, context: Context) => {
  try {
    let accessTokenSetting = await config.get({
      settingName: 'fcm_notification_credentials'
    }) as {
      access_token: string;
      expiry_date: number;
      id_token: null;
      refresh_token: string;
      settingName: string;
      token_type: string;
    } | undefined;
    if (!accessTokenSetting || (Date.now() - accessTokenSetting.expiry_date) > 0) {
      await rotateCreds();
      accessTokenSetting = await config.get({
        settingName: 'fcm_notification_credentials'
      }) as any;
    }
    const globalSetting = await config.get({
      settingName: 'global'
    }) as {
      fcmKey: string; // vapid key
      firebaseApp: {
        projectId: string;
      }
    };
    const registeredTenants = await registrydb.getAll({
      tenantId: { op: "=", value: "sammons" }
    }) as {
      token: string;
      createdAt: string;
      tenantId: string;
      username: string;
    }[];
    for (let registry of registeredTenants) {
      try {
        await gapis.google.fcm("v1").projects.messages.send({
          access_token: accessTokenSetting?.access_token,
          parent: `projects/${globalSetting.firebaseApp.projectId}`,
          requestBody: {
            message: {
              token: registry.token,
              android: {
                notification: {
                  title: "Thanks for registering on Android!"
                }
              },
              notification: {
                title: "Thanks for registering!"
              }
            }
          }
        });
        console.log('messaged', registry.username, 'at', registry.token)
      } catch (e) {
        console.log('failed to send', e)
      }
    }
    console.log('success');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}


const rotateCreds = async () => {
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
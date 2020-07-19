import { NotesClient } from "src/clients/notes-client";
import { MakeStateful } from "./state-maker";
import React from "react";

declare const firebase: {
  initializeApp: (config: {}) => {}
  messaging: () => {
    requestPermission(): Promise<void>
    usePublicVapidKey: (key: string) => void
    getToken: () => Promise<string>;
    onTokenRefresh: (cb: () => void) => void
    onMessage: (cb: (payload: {title: string; icon: string; body: string; link: string;}) => void) => void
  }
};

const { state: FCMState } = MakeStateful('fcm-token', {}, {
  token: "",
  havePermission: false,
  settings: null as {}|null
}, {}, () => <React.Fragment />)

const registerTokenIfNeeded = async (messaging: ReturnType<typeof firebase['messaging']>) => {
  try {
    const token = await messaging.getToken();
    if (FCMState.stored.token != token) {
      await new NotesClient().registerFCMToken(token)
      FCMState.stored.token = token
      console.log('new token', token)
    } else {
      console.log('fcm token matches')
    }
  } catch (e) {
    console.log('failure during fcm token registry', e)
  }
}

const proceedWithPermission = (fcmKey: string, messaging: ReturnType<typeof firebase['messaging']>) => {
  messaging.usePublicVapidKey(fcmKey);
  registerTokenIfNeeded(messaging);

  messaging.onTokenRefresh(() => {
    registerTokenIfNeeded(messaging);
  });

  messaging.onMessage(payload => {
    console.log('message received', payload)
  });
}

export const Register = async () => {
  try {
    const settings = await new NotesClient().settings()
    FCMState.stored.settings = settings;
    firebase.initializeApp(settings.firebaseApp)
    const messaging = firebase.messaging();
    if (!FCMState.stored.havePermission) {
      await messaging.requestPermission()
      FCMState.stored.havePermission = true;
    }
    proceedWithPermission(settings.fcmKey, messaging)

    const broadcast = new BroadcastChannel('fcm-settings');
    let initialBroadcastCheck = setInterval(() => {
      navigator.serviceWorker.getRegistrations().then(r => {
        if (r.some(reg => reg.scope.includes('firebase-cloud-messaging-push-scope'))) {
          if (initialBroadcastCheck) {
            clearInterval(initialBroadcastCheck);
            initialBroadcastCheck = null;
            setTimeout(() => {
              broadcast.postMessage(settings);
              console.log('settings broadcast sent')
            }, 15) // give time to establish broadcast channel
          }
        }
      })
    }, 200) as NodeJS.Timeout|null;
  } catch (e) {
    console.log(e)
  }
}

Register();
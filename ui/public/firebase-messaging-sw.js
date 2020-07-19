try {
  console.log('importing scripts')
  importScripts(
    'https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js'
  );
  console.log('FCM service worker running')

  const broadcast = new BroadcastChannel('fcm-settings');
  let isregistered = false
  broadcast.onmessage = (event) => {
    if (event && !isregistered) {
      console.log('initializing firebase in service worker')
      firebase.initializeApp(event.data.firebaseApp);
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey(event.data.fcmKey);
      messaging.setBackgroundMessageHandler(payload => {
        console.log('message received', payload)
      })
      isregistered = true;
    } else {
      console.log('already registered')
    }
  }
} catch (e) {
  console.log('failed',e)
}
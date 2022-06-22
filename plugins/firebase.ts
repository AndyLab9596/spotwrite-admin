import * as firebase from 'firebase/app';
import 'firebase/messaging';

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
});

let firebaseMessaging = null;
const isSupported = firebase.messaging.isSupported();

if (isSupported) {
  firebaseMessaging = firebase.messaging();
  const publicVapidKey = process.env.publicVapidKey as string;
  firebaseMessaging.usePublicVapidKey(publicVapidKey);

  navigator.serviceWorker
    .register(
      `/message-sw.js?apiKey=${process.env.apiKey}&authDomain=${process.env.authDomain}&projectId=${process.env.projectId}&storageBucket=${process.env.storageBucket}&messagingSenderId=${process.env.messagingSenderId}&appId=${process.env.appId}`
    )
    .then((registration: ServiceWorkerRegistration) =>
      // eslint-disable-next-line no-use-before-define
      messaging?.useServiceWorker(registration)
    )
    .catch((err: any) => console.error(err));
}

// eslint-disable-next-line import/prefer-default-export
export const messaging = firebaseMessaging;

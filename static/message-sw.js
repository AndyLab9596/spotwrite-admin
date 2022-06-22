/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js');

var apiKey = new URL(location).searchParams.get('apiKey');
var authDomain = new URL(location).searchParams.get('authDomain');
var projectId = new URL(location).searchParams.get('projectId');
var storageBucket = new URL(location).searchParams.get('storageBucket');
var messagingSenderId = new URL(location).searchParams.get('messagingSenderId');
var appId = new URL(location).searchParams.get('appId');

var firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

firebase.initializeApp(firebaseConfig);

const isSupported = firebase.messaging.isSupported()
if (isSupported) {
  const showPushNotification = (datum, swRegistration) => {
    const options = {
      title: datum.notification.title,
      body: datum.notification.body,
      icon: datum.notification.icon,
      tag: datum.notification.tag,
      data: {
        destination: datum.data.destination,
      },
    }
    swRegistration
      .showNotification(datum.notification.title, options)
      .then(_ => {
      })
      .catch(error => console.error(error.messaging))
  }

  const setEventListeners = sw => {
    sw.addEventListener('push', event => {
      try {
        const datum = JSON.parse(event.data.text())
        showPushNotification(datum, sw.registration)
      } catch (error) {
        console.error(error.message)
      }
    })

    sw.addEventListener('notificationclick', async event => {
      event.notification.close()
      let destination = event.notification.data.destination
      if (event.notification.data.FCM_MSG) {
        destination = event.notification.data.FCM_MSG.data.destination
      }
      if (!destination) {
        return
      }

      await event.waitUntil(
        clients
          .matchAll()
          .then(async clientList => {
            let shouldOpen = true
            await Promise.all(
              clientList.map(async client => {
                if (client.url === destination && 'focus' in client) {
                  shouldOpen = false
                  return await client
                    .focus()
                    .then(_ => console.log('    client:', client.url))
                }
              }),
            )
            if (shouldOpen && 'openWindow' in clients) {
              await clients.openWindow(destination)
            }
            event.notification.close()
          })
          .catch(error => console.error('  ', error.toString())),
      )
    })
  }

  setEventListeners(self)
}



const CACHE_NAME = '1.0'
const CACHE_LIST = [];

self.addEventListener('install', installEvent => {

  self.skipWaiting()
})

self.addEventListener('activate', activateEvent => {

  self.clients.claim()
})

self.addEventListener('fetch', fetchEvent => {

})


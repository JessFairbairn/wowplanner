// Set the callback for the install step
self.addEventListener('install', function(event) {
  console.log("Installing service worker");
});

self.addEventListener('fetch', function(event) {
  //debugger;
});
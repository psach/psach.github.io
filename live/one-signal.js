// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.
document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };
  window.plugins.OneSignal
    //.startInit("d8131c11-f747-48c9-8288-2ee20f86cd6d")
    .startInit("2c824581-04af-45d5-97ec-975cb3444587")
    .handleNotificationOpened(notificationOpenedCallback)
    .inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification)
    .endInit();
}, false);

var app = angular.module('plugApp');
app.service('plugApiService', function() {
  var apis = {
      "timelineApi": "https://api.plug.chat/getTimeline?pageid=",
      "getPagesApi": "https://api.plug.chat/getPages/page?name=",
      "getAllApi": "https://api.plug.chat/actionsAndCategories",
      "subscribeToAppApi": "https://api.plug.chat/subscribeToApp/subscribe?pageid=",
      "sendMessageApi": "https://api.plug.chat/sendMessage",
      "updateOrderApi": "https://api.plug.chat/updateCategoryOrder",
      "getMessengerProfileApi": "https://api.plug.chat/getMessengerProfile",
      "getNewMessageApi": "https://api.plug.chat/getNewMessage/msg?date=",
      "setGreetingTextApi": "https://api.plug.chat/setGreetingText",
      "deleteImageApi": "https://api.plug.chat/deleteImage",
      "whitelistApi": "https://api.plug.chat/whitelist",
      "deleteMessengerProfileEntryApi": "https://api.plug.chat/deleteMessengerProfileEntry",
      "setAndSavePersistentMenuApi": "https://api.plug.chat/setAndSavePersistentMenu",
      "setPersistentMenuApi": "https://api.plug.chat/setPersistentMenu",
      "unreadMessageCountApi": "https://api.plug.chat/unreadMessageCount/reset?userid=",
      "deletePersistentMenuFbApi": "https://api.plug.chat/deletePersistentMenuFb",
      "deleteGreetingTextApi": "https://api.plug.chat/deleteGreetingText",
      "deleteGreetingTextFromFbApi": "https://api.plug.chat/deleteGreetingTextFB",
      "deleteGetStartedFromFbApi": "https://api.plug.chat/deleteGetStartedFB",
      "deleteGetStartedApi": "https://api.plug.chat/deleteGetStarted",
      "setGetStartedApi": "https://api.plug.chat/setGetStarted",
      "signupApi":"https://api.plug.chat/signupForBeta"
  };

    this.getApi = function(query) {
        return apis[query];
    };

});

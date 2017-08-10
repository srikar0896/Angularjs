var app = angular.module('plugApp');

app.service("messengerProfileService", function(){
var messengerProfiles = [];
var currentMessengerProfile ={};

  return {
    setMessengerProfiles : function(obj){
      messengerProfiles = obj;
    },

    getMessengerProfiles : function(){
      return messengerProfiles;
    },

    setCurrentMessengerProfile : function(obj){
      currentMessengerProfile = obj;
    },

    getCurrentMessengerProfile : function(){
        return currentMessengerProfile;
    },

    returnProfileType : function(obj) {
        var type = "";
        if (Object.keys(obj).indexOf('text') >= 0) {
            type = "greetingText";
        }
        if (Object.keys(obj).indexOf('payload') >= 0) {
            type = "getStarted";
        }
        if (Object.keys(obj).indexOf('callToActions') >= 0) {
            type = "persistantMenu";
        }
        return type;
    },

    isPublishable : function(obj) {
        var flag = false;
        if (typeof obj !== 'undefined') {

            if (Object.keys(obj).indexOf('ProfileID') >= 0) {
                flag = true;
            } else {
                flag = false;
            }
        }

        return flag;
    },

    checkGetStartedExists : function(){
      var flag = false;
      if (messengerProfiles.length > 0) {
          for (var j = 0; j < messengerProfiles.length; j++) {
              if (Object.keys(messengerProfiles[j]).indexOf('payload') < 0) {

              } else {
                 flag = true;
              }
          }
      }
      return flag;
    },

    checkGreetingTextExists : function(){
      var flag = false;
      if (messengerProfiles.length > 0) {
          for (var j = 0; j < messengerProfiles.length; j++) {
              if (Object.keys(messengerProfiles[j]).indexOf('text') < 0) {

              } else {

                 flag = true;
              }
          }
      }
      return flag;
    },

    checkPerMenExists : function() {

        var flag = false;
        if (messengerProfiles.length > 0) {
            for (var j = 0; j < messengerProfiles.length; j++) {
                if (Object.keys(messengerProfiles[j]).indexOf('callToActions') >= 0) {
                    var flag = true;
                }
            }
        }
        return flag;
    }
  }
});

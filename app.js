var app = angular.module('plugApp',['ui.router','ui.bootstrap','xeditable','luegg.directives']);

app.controller('plugController',['cacheService', '$scope','$state','$timeout','$location','$q',
function(cacheService,$scope,$state,$timeout,$location,$q){
  var lock = new Auth0Lock('XABSNrV7kCHkAeeM70YY5MHnaUPfv2gk','ksg207.auth0.com',$scope.options);
  lock.on("authorization_error",function(result){
      console.log("Error");
      if(result.error == "unauthorized"){
              $state.go('signupPrompt');
          }
    });

  lock.on("authenticated", function(authResult) {
      lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
          // Error Handling
      }
      cacheService.setUserName(profile.name);
      cacheService.setUserEmail(profile.email);
      cacheService.setUserPicture(profile.picture);
      console.log(cacheService.getLoginData());
       $state.go('appPage');
      });

    });

  }]);

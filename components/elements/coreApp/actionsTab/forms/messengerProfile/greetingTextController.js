var app = angular.module('plugApp');

app.controller('greetingTextController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','menuService','messengerProfileService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,menuService,
  messengerProfileService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';
  $scope.all=[];

  $scope.sgt = false;
  $scope.gtswitchState = false;
  $scope.gtpreservedState = false;
  $scope.gtlabelShow = false;
  $scope.gtlabel = 'disabled';

  $scope.publishLoader = false;

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("updateMessengerProfile", function(){
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("openMessengerProfile", function(event,data){
    if(data.profile_type == 'greetingText'){
      $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
      $scope.openGreetingTextForm();
    }
  });

  $scope.openGreetingTextForm = function(){
    var flag = false;
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
    if ($scope.messengerProfiles.length > 0) {
        for (var i = 0; i < $scope.messengerProfiles.length; i++) {
              $scope.currentMessengerProfile = $scope.messengerProfiles[i];
              messengerProfileService.setCurrentMessengerProfile($scope.currentMessengerProfile);
            if (messengerProfileService.returnProfileType($scope.currentMessengerProfile) == 'greetingText') {
                var flag = true;
                $scope.greetingMsg = $scope.currentMessengerProfile.text;
                if (Object.keys($scope.currentMessengerProfile).indexOf('status') > -1) {
                    if ($scope.currentMessengerProfile.status == 'inactive') {
                        $scope.sgt = false;
                        $scope.gtswitchState = false;
                    } else {
                        $scope.sgt = true;
                        $scope.gtswitchState = true;
                    }
                } else {

                    $scope.sgt = true;
                    $scope.gtswitchState = true;

                }
                $scope.isPublishableBtn = messengerProfileService.isPublishable($scope.currentMessengerProfile);
            }
            if (i == $scope.messengerProfiles.length - 1 && flag == false) {
                $scope.greetingMsg = '';
                var x = {};
                $scope.isPublishableBtn = messengerProfileService.isPublishable(x);
            }
        }
    } else {
        $scope.greetingMsg = '';
        var y = {};
        $scope.isPublishableBtn = messengerProfileService.isPublishable(y);
    }
  };

  $scope.checkGreetingTextExists = function(){
    return messengerProfileService.checkGreetingTextExists();
  };

  $scope.greetingToggleButton = function(x) {
      $scope.gtswitchState = x.sgt;
      $scope.gtpreservedState = x.sgt;
      if ($scope.gtswitchState == false) {
        var data = {};
        data["url"] = plugApiService.getApi('deleteGreetingTextFromFbApi');
        data["type"] = 'Greeting Text';
        $rootScope.$broadcast('deleteMessengerProfileEntry',data);
          // $scope.deleteMenuFromFb(plugApiService.getApi('deleteGetStartedFromFbApi'), 'Get Started Button');
        $scope.updateGreetingTextStatus("inactive");
      }
      if ($scope.gtswitchState == true) {
          $scope.updateGreetingTextStatus("active");
      }
  };

  $scope.updateGreetingTextStatus = function(status) {
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
      obj["status"] = status;
      $scope.currentMessengerProfile["status"] = status;
      var url = plugApiService.getApi('setPersistentMenuApi');

      $http({
              method: 'POST',
              url: url,
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              console.log(response);
              if (response.errorMessage) {

                  alertService.addAlert("Unable to update the status of Get Started Button", "err");
                  if (status == "active") {
                      $scope.sgt = false;
                      $scope.gtswitchState = false;

                  } else {
                      $scope.gtswitchState = true;
                      $scope.sgt = true;

                  }


              } else {
                  if (status == "inactive") {
                      $scope.sgt = false;
                      $scope.gtswitchState = false;

                  } else {
                      $scope.gtswitchState = true;
                      $scope.sgt = true;

                  }
                  for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                      if (Object.keys($scope.messengerProfiles[k]).indexOf('text') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                          $scope.messengerProfiles[k] = obj;
                      }
                  }
                  alertService.addAlert("Successfully updated the status of Get Started button.", "succ");
              }
          });
  };

  $scope.saveGreetingText = function() {
      $scope.showGreetingSaveLoader = true;
      var isExist = messengerProfileService.checkGreetingTextExists();
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      if (isExist == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gtswitchState == true) {
              obj["status"] = 'active';
          } else {
              obj["status"] = 'inactive';
          }
      }else{
        obj["status"] = 'active';
      }

      var url = plugApiService.getApi('setPersistentMenuApi');

      $http({
              method: 'POST',
              url: url,
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.showGreetingSaveLoader = false;
              if (response.errorMessage) {
                  alertService.addAlert("Something went wrong.Please try again later.", "err");
              } else {

                  if (Object.keys(obj).indexOf("ProfileID") < 0) {
                      obj["ProfileID"] = response.ProfileID;
                      $scope.isPublishableBtn = true;
                      $scope.messengerProfiles.push(obj);
                      $scope.currentMessengerProfile = {};
                      $scope.currentMessengerProfile = obj;
                      messengerProfileService.setMessengerProfiles($scope.messengerProfiles);
                      $rootScope.$broadcast('updateMessengerProfiles');
                      alertService.addAlert("Greeting Text saved.", "succ");
                  } else {
                      for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                          if (Object.keys($scope.messengerProfiles[k]).indexOf('text') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                              $scope.messengerProfiles[k] = obj;
                              $scope.currentMessengerProfile = {};
                              $scope.currentMessengerProfile = obj;
                          }
                          messengerProfileService.setMessengerProfiles($scope.messengerProfiles);
                          $rootScope.$broadcast('updateMessengerProfiles');
                          alertService.addAlert("Greeting Text updated.", "succ");
                      }
                  }
              }
          });
  };

  $scope.publishGreetingText = function() {
      var flag = messengerProfileService.checkGreetingTextExists();
      var msg = {};
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      if (flag == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gtswitchState == true) {
              obj["status"] = 'active';
              $scope.publishGreeting(obj);
          }else {
            $scope.showDisableModal();
          }
      }
  };

  var disablePublishModal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/disablePublishforMessengerProfileModal',
        scope: $scope
      });
  };

  $scope.showDisableModal = function(){
    disablePublishModal().result
      .then(function(){
             console.log("result functiuon");
           });
  };

  $scope.closeModal = function(){
    $scope.modalInstance.close('ok');
  };
  $scope.publishGreeting = function(obj) {
      var ob = obj;
      //  console.log(ob);
      $scope.publishLoader = true;
      var url = plugApiService.getApi('setGreetingTextApi');
      $http({
              method: 'POST',
              url: url,
              data: ob,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.publishLoader = false;
              if (response!='null') {
                  alertService.addAlert("Something went wrong.Please try again later", "err");

              } else {

                  alertService.addAlert("Get started button published", "succ");

              }
          });
  };

}]);

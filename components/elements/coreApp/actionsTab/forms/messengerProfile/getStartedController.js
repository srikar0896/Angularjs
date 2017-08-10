var app = angular.module('plugApp');

app.controller('getStartedButtonController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','menuService','messengerProfileService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,menuService,
  messengerProfileService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';
  $scope.all=[];

  $scope.gst = false;
  $scope.gsswitchState = false;
  $scope.gspreservedState = false;
  $scope.gslabelShow = false;
  $scope.gslabel = 'disabled';

  $scope.publishLoader = false;

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("updateMessengerProfile", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("openMessengerProfile", function(event,data){
    // if(data.profile_type == 'persistentMenu'){
    //   $scope.activeForm = 'persistentMenuForm'
    // }
    // if(data.profile_type == 'greetingText'){
    //   $scope.activeForm = 'greetingTextForm';
    // }
    if(data.profile_type == 'getStartedButton'){
      // $scope.activeForm = 'getStartedButtonForm';
      $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
      $scope.openGetStartedButtonForm();
    }
  });

  $scope.openGetStartedButtonForm = function(){
    var flag = false;
    if ($scope.messengerProfiles.length > 0) {
        for (var i = 0; i < $scope.messengerProfiles.length; i++) {
              $scope.currentMessengerProfile = $scope.messengerProfiles[i];
              messengerProfileService.setCurrentMessengerProfile($scope.currentMessengerProfile);
            if (messengerProfileService.returnProfileType($scope.currentMessengerProfile) == 'getStarted') {
                var flag = true;
                $scope.getStartedMsg = $scope.currentMessengerProfile.payload.text;
                if (Object.keys($scope.currentMessengerProfile).indexOf('status') > -1) {
                    if ($scope.currentMessengerProfile.status == 'inactive') {
                        $scope.gst = false;
                        $scope.gsswitchState = false;
                    } else {
                        $scope.gst = true;
                        $scope.gsswitchState = true;
                    }
                } else {

                    $scope.gst = true;
                    $scope.gsswitchState = true;

                }
                $scope.isPublishableBtn = messengerProfileService.isPublishable($scope.currentMessengerProfile);
            }
            if (i == $scope.messengerProfiles.length - 1 && flag == false) {
                $scope.getStartedMsg = '';
                var x = {};
                $scope.isPublishableBtn = messengerProfileService.isPublishable(x);
            }
        }
    } else {
        $scope.getStartedMsg = '';
        var y = {};
        $scope.isPublishableBtn = messengerProfileService.isPublishable(y);
    }
  };

  $scope.checkGetStartedExists = function(){
    return messengerProfileService.checkGetStartedExists();
  };

  $scope.getStartedToggleButton = function(x) {
      $scope.gsswitchState = x.gst;
      $scope.gspreservedState = x.gst;
      if ($scope.gsswitchState == false) {
        var data = {};
        data["url"] = plugApiService.getApi('deleteGetStartedFromFbApi');
        data["type"] = 'Get Started Button';
        $rootScope.$broadcast('deleteMessengerProfileEntry',data);
          // $scope.deleteMenuFromFb(plugApiService.getApi('deleteGetStartedFromFbApi'), 'Get Started Button');
        $scope.updateGetStartedStatus("inactive");
      }
      if ($scope.gsswitchState == true) {
          $scope.updateGetStartedStatus("active");
      }
  };

  $scope.updateGetStartedStatus = function(status) {
      var msg = {};
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      msg["text"] = $scope.getStartedMsg;
      obj["payload"] = msg;
      obj["Type"] = "getstarted";
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
              if (response.errorMessage) {
                  alertService.addAlert("Unable to update the status of Get Started Button", "err");
                  if (status == "active") {
                      $scope.gst = false;
                      $scope.gsswitchState = false;

                  } else {
                      $scope.gsswitchState = true;
                      $scope.gst = true;
                  }

              } else {
                  if (status == "inactive") {
                      $scope.gst = false;
                      $scope.gsswitchState = false;

                  } else {
                      $scope.gsswitchState = true;
                      $scope.gst = true;

                  }
                  for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                      if (Object.keys($scope.messengerProfiles[k]).indexOf('payload') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                          $scope.messengerProfiles[k] = obj;
                      }
                  }
                  alertService.addAlert("Successfully updated the status of Get Started button.", "succ");
              }
          });
  };

  $scope.saveGetStarted = function() {
      $scope.showGettingStartedSaveLoader = true;
      var isExist = messengerProfileService.checkGetStartedExists();
      var msg = {};
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      msg["text"] = $scope.getStartedMsg;
      obj["payload"] = msg;
      obj["Type"] = "getstarted";
      if (isExist == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gsswitchState == true) {
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
              $scope.showGettingStartedSaveLoader = false;
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
                      alertService.addAlert("Get Started Button saved.", "succ");
                  } else {
                      for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                          if (Object.keys($scope.messengerProfiles[k]).indexOf('payload') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                              $scope.messengerProfiles[k] = obj;
                              $scope.currentMessengerProfile = {};
                              $scope.currentMessengerProfile = obj;
                          }
                          messengerProfileService.setMessengerProfiles($scope.messengerProfiles);
                          $rootScope.$broadcast('updateMessengerProfiles');
                          alertService.addAlert("Getting Started Button updated.", "succ");
                      }
                  }
              }
          });
  };

  $scope.publishGetStartedButton = function() {
      var flag = messengerProfileService.checkGetStartedExists();
      var msg = {};
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      msg["text"] = $scope.getStartedMsg;
      obj["payload"] = msg;
      obj["Type"] = "getstarted";
      if (flag == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gsswitchState == true) {
              obj["status"] = 'active';
              $scope.publishGetStarted(obj);
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
  $scope.publishGetStarted = function(obj) {
      var ob = obj;
      //  console.log(ob);
      $scope.publishLoader = true;
      var url = plugApiService.getApi('setGetStartedApi');
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
              if (response.errorMessage) {
                  alertService.addAlert("Something went wrong.Please try again later", "err");

              } else {

                  alertService.addAlert("Get started button published", "succ");

              }
          });
  };

}]);

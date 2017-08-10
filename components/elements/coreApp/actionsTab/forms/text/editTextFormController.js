var app = angular.module('plugApp');

app.controller('editTextFormController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService){

    $scope.userData = cacheService.getLoginData();
    $scope.selectedPage = '';

    $scope.all=[];

    $rootScope.$on("updatePageContent", function(){
      $scope.selectedPage = fbPagesService.getSelectedPage();
      $scope.all = [];
      $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    });

    $rootScope.$on("updateActionsAndCategories", function(event,obj){
      $scope.all = [];
      $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    });

    $rootScope.$on("openForm", function(event,data){
      if(data.formName == 'editTextForm'){
        $scope.openEditTextForm();
      }
    });




  $scope.openEditTextForm = function(){
      var actionId = actionsAndCategoriesService.getActiveActionId();
      var catId = actionsAndCategoriesService.getSelectedCategory();
      if (actionId && catId) {
          for (var i = 0; i < $scope.all.length; i++) {
              if (catId == $scope.all[i].CategoryID) {

                  for (var j = 0; j < $scope.all[i].actions.length; j++) {
                      if (actionId == $scope.all[i].actions[j].ActionID) {

                          $scope.actionName = $scope.all[i].actions[j].ActionName;
                          $scope.actionMsg = $scope.all[i].actions[j].Message;

                          if (Object.keys($scope.all[i].actions[j]).indexOf('Shortcut') >= 0) {

                              $scope.actionShortcut = $scope.all[i].actions[j].Shortcut.substr(2).trim();
                          } else {
                            $scope.actionShortcut = '';
                          }
                      }
                  }
              }
          }
          //
          // $('#actionName').val($scope.action.actionName).trigger('input');
          // $('#actionMsg').val($scope.action.message);
          //
          // angular.element(jQuery('#actionName')).triggerHandler('input');
          // angular.element(jQuery('#actionShortcut')).triggerHandler('input');
          // angular.element(jQuery('#actionMsg')).triggerHandler('input');
          // // alert($scope.editActionName + " -- " + $scope.editActionName.length);
          // $scope.editMsg = $('#actionMsg').val();
      }
  };

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.updateTextAction = function() {
      var editName = $scope.actionName;
      var editSrct = $scope.getShortcutForAction('//' + $scope.actionShortcut);
      var editMsg = $scope.actionMsg;
      var editObj = {
          "PageID": $scope.selectedPage.page_id,
          "ActionID": actionsAndCategoriesService.getActiveActionId(),
          "ActionName": editName,
          "Shortcut":editSrct,
          "Message": editMsg,
          "Type": 'text'
      };

    if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 ) {
          $scope.showViewLoader = true;
          $http({
                  method: 'PUT',
                  url: plugApiService.getApi('getAllApi') + '/action',
                  data: editObj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  alertService.addAlert("Successfully updated " + editObj.ActionName + " action.", "succ");
                  for (var i = 0; i < $scope.all.length; i++) {
                      for (var j = 0; j < $scope.all[i].actions.length; j++) {
                          if (actionsAndCategoriesService.getActiveActionId() == $scope.all[i].actions[j].ActionID) {
                              $scope.updateTextItemData(editName, editMsg, editSrct);
                              $scope.showSavedLabel = true;
                              $scope.showViewLoader = false;
                              setTimeout(function() {
                                  $scope.showSavedLabel = false;
                              }, 1000);
                          }
                      }
                  }
              });
      }
  };

  $scope.updateTextItemData = function(name, Msg, srt) {
      for (var i = 0; i < $scope.all.length; i++) {
          for (var j = 0; j < $scope.all[i].actions.length; j++) {
              if ($scope.activeActionId == $scope.all[i].actions[j].ActionID) {
                  $scope.all[i].actions[j].ActionName = name;
                  $scope.all[i].actions[j].Message = Msg;
                  $scope.all[i].actions[j].Shortcut = srt;
                  actionsAndCategoriesService.setActionsAndCategries($scope.all);
                  $rootScope.$broadcast('updateActionsAndCategories');
              }
          }
      }
  };

}]);

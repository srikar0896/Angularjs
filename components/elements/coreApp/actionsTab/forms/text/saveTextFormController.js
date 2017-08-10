var app = angular.module('plugApp');

app.controller('saveTextFormController',[
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
    if(data.formName == 'saveTextForm'){
      $scope.openSaveTextForm();
    }
  });

  $scope.openSaveTextForm = function(){
    $scope.selectedCatName = actionsAndCategoriesService.getCategoryNameById(actionsAndCategoriesService.getSelectedCategory());
    $scope.actionName = ''
    $scope.actionMsg = '';
    $scope.actionShortcut = '';
  };

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.saveTextAction = function() {

      var actionName = $scope.actionName;
      var actionMsg = $scope.actionMsg;
      var actionShortcut = $scope.getShortcutForAction("//" + $scope.actionShortcut);
      var catId = actionsAndCategoriesService.getSelectedCategory();

if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 ) {
          $scope.showSaveLoader = true;
          if (actionName) {
              var newAction = {
                  CategoryID: catId,
                  PageID: $scope.selectedPage.page_id,
                  ActionName: capitalizeService.capitalizeFirstLetter(actionName),
                  Message: actionMsg,
                  status: 'active',
                  Notes: 'null',
                  Shortcut:actionShortcut,
                  Type: 'text'
              };
              $http({
                      method: 'POST',
                      url: plugApiService.getApi('getAllApi') + '/action',
                      data: newAction,
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  })
                  .success(function(response) {
                      if (response.ActionID) {
                          alertService.addAlert("New Action added in " + actionsAndCategoriesService.getCategoryNameById(newAction.CategoryID) + " Group", "succ");
                          $scope.showSaveLoader = false;
                          for (var i = 0; i < $scope.all.length; i++) {

                              if (newAction.CategoryID == $scope.all[i].CategoryID) {
                                  $scope.actionName = '';
                                  $scope.actionShortcut = '';
                                  $scope.all[i].actions.push(newAction);
                                  for (i = 0; i < $scope.all.length; i++) {
                                      for (j = 0; j < $scope.all[i].actions.length; j++) {
                                          if (newAction.ActionName == $scope.all[i].actions[j].ActionName) {
                                              $scope.all[i].actions[j]['ActionID'] = response.ActionID;
                                              actionsAndCategoriesService.setActionsAndCategries($scope.all);
                                              $rootScope.$broadcast('updateActionsAndCategories');
                                              var data = {};
                                              data["actId"] = response.ActionID;
                                              data["catId"] = newAction.CategoryID;
                                              $rootScope.$broadcast('viewAction',data);
                                              //$scope.viewAction(response.ActionID, newAction.CategoryID);
                                              //$scope.actionIDS.push(response.ActionID);

                                          }
                                      }
                                  }
                              }
                          }
                      } else {
                          //alert("Error in creating a new Action");
                          alertService.addAlert("Problem in adding " + actionsAndCategoriesService.getCategoryNameById(newAction.CategoryID) + " Group", "Err")
                          $scope.showSaveLoader = false;
                      }
                  });

          }
      }
  };

}]);

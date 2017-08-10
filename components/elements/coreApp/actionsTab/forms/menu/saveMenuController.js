var app = angular.module('plugApp');

app.controller('saveMenuController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService','menuService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService,menuService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';

  $scope.all=[];
  $scope.newButtonOption = true;

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateMenuButtons", function(){
    $scope.menuButtons = menuService.getMenuButtons();
    $scope.menuBtnName = '';
    $scope.newButtonOption = true;
  });

  $("#menuActions").chosen({
      max_selected_options: 1
  });

  $rootScope.$on("openForm", function(event,data){
    if(data.formName == 'saveMenuForm'){
      $scope.openSaveMenuForm();
    }
  });

  $rootScope.$on("updateFakeButtonName", function(event,obj){
    $scope.menuBtnName = obj["name"];
  });


  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };
  $scope.openSaveMenuForm = function(){
      $scope.selectedCatName = actionsAndCategoriesService.getCategoryNameById(actionsAndCategoriesService.getSelectedCategory());
      $scope.actionName = '';
      $scope.actionShortcut = '';
      $scope.menuMsg = '';
      $scope.menuButtons = [];
      menuService.setMenuButtons($scope.menuButtons);
      console.log("set menu buttons");
  };

  $scope.saveMenu = function() {
      var catId = actionsAndCategoriesService.getSelectedCategory();
      var menuName = capitalizeService.capitalizeFirstLetter($scope.actionName).trim();
      var menuShortcut = $scope.getShortcutForAction("//" + $scope.actionShortcut).trim();
      var menuTitle = $scope.menuMsg;
      var menuObj = {
          "status": 'active',
          "PageID": $scope.selectedPage.page_id,
          "MenuTitle": menuTitle,
          "ActionName": menuName,
          'Type': 'menu',
          'CategoryID': catId,
          'Shortcut':menuShortcut,
          'Notes': 'null'
      };

      if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 && $scope.menuMsg.length>0 && $scope.menuMsg.length<640) {

          $scope.showSaveLoader = true;

          for (var x = 0; x < 3; x++) {
              if (x < $scope.menuButtons.length) {


                  var i = {};
                  var actions = {};

                  i["Name"] = $scope.menuButtons[x].Name;
                  if ($scope.menuButtons[x].type == 'phone_number') {

                      i['payload'] = $scope.menuButtons[x].payload;
                      i['type'] = 'phone_number';
                  }
                  if ($scope.menuButtons[x].type == 'web_url') {
                      i['url'] = $scope.menuButtons[x].url;
                      i['type'] = 'web_url';
                  }
                  if (Object.keys($scope.menuButtons[x]).indexOf('type') == -1) {
                      i["actions"] = $scope.menuButtons[x].actions;

                  }
                  menuObj["Button" + x] = i;

              } else {
                  menuObj["Button" + x] = 'null';
              }
          }

          $http({
                  method: 'POST',
                  url: plugApiService.getApi('getAllApi') + '/action',
                  Type: 'menu',
                  data: menuObj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  alertService.addAlert("successfully updated " + menuObj.ActionName + " in " + actionsAndCategoriesService.getCategoryNameById(menuObj.CategoryID) + " group", "succ");
                  if (response.ActionID) {

                      for (var i = 0; i < $scope.all.length; i++) {
                          if (menuObj.CategoryID == $scope.all[i].CategoryID) {
                              menuObj["ActionID"] = response.ActionID;
                              $scope.all[i].actions.push(menuObj);
                              actionsAndCategoriesService.setActionsAndCategries($scope.all);
                              $rootScope.$broadcast('updateActionsAndCategories');
                              var data = {};
                              data["actId"] = response.ActionID;
                              data["catId"] = menuObj.CategoryID;
                              $rootScope.$broadcast('viewAction',data);
                          }
                      }
                      $scope.showSaveLoader = false;
                  } else {
                    alertService.addAlert("Unable to Create an action.Please try again later.","err");
                    $scope.showSaveLoader = false;
                  }
              });
      } else {

      }
  };

  $scope.addMenuButton = function() {
      $('#addButtonArrow').css('top', ($scope.menuButtons.length + 1) * 50 + "px");
      $('#addTabs a[data-target="#tab1"]').tab('show');

      $scope.newButtonOption = true;
      var data = {};
      data["formName"] = 'addButtonForm';
      $rootScope.$broadcast('openButtonForm',data);
      $scope.newButtonOption = false;
  };

  $scope.editButton = function(x) {
    var obj = {};
    obj["buttonIndex"] = x;
    obj["menuButtons"] = $scope.menuButtons[x];
    $rootScope.$broadcast("viewButton",obj);
  };

}]);

var app = angular.module('plugApp');

app.controller('editMenuController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService','menuService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService,menuService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';

  $scope.all=[];
  $scope.actionsAndCategoriesService = actionsAndCategoriesService;
  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $("#editButtonActions").chosen({
      max_selected_options: 1
  });

  $rootScope.$on("openForm", function(event,data){
    if(data.formName == 'editMenuForm'){
      $scope.openEditMenuForm();
    }
  });

  $rootScope.$on("updateMenuButtons", function(){
    $scope.menuButtons = menuService.getMenuButtons();
    $scope.menuBtnName = '';
    $scope.newButtonOption = true;
  });

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.openEditMenuForm = function(){

        $scope.menuButtons = [];
        $scope.checkAlternateAvailabilityStatus = false;
        var actionId = actionsAndCategoriesService.getActiveActionId();
        var catId = actionsAndCategoriesService.getSelectedCategory();
        if (actionId && catId) {

            for (var a = 0; a < $scope.all.length; a++) {
                if (catId == $scope.all[a].CategoryID) {
                    for (var b = 0; b < $scope.all[a].actions.length; b++) {
                        if (actionId == $scope.all[a].actions[b].ActionID) {
                          $scope.actionName = $scope.all[a].actions[b].ActionName;
                          $scope.menuMsg = $scope.all[a].actions[b].MenuTitle;
                          if (Object.keys($scope.all[a].actions[b]).indexOf('Shortcut') > -1) {
                                $scope.actionShortcut = $scope.all[a].actions[b].Shortcut.substr(2).trim();
                            } else {
                                $scope.actionShortcut = '';
                            }
                            for (var e = 0; e < 3; e++) {
                                if ($scope.all[a].actions[b]["Button" + e] != 'null') {
                                    $scope.menuButtons.push($scope.all[a].actions[b]["Button" + e]);
                                    menuService.setMenuButtons($scope.menuButtons);
                                    $rootScope.$broadcast("updateMenuButtons");
                                }
                            }
                        }
                    }
                }
            }
            $scope.changeNewButtonOption = true;
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

  $scope.updateMenu = function() {
      var editName = $scope.actionName;
      var editSrct = $scope.getShortcutForAction('//' + $scope.actionShortcut);
      var msg = $scope.menuMsg;
      var editObj = {
          "PageID": $scope.selectedPage.page_id,
          "CategoryID": actionsAndCategoriesService.getSelectedCategory(),
          "ActionID": actionsAndCategoriesService.getActiveActionId(),
          "ActionName": editName,
          "Type": 'menu',
          "status": "active",
          "MenuTitle": msg,
          "Shortcut":editSrct
      };
      for (var u = 0; u < 3; u++) {
          if (u < $scope.menuButtons.length) {
              editObj["Button" + u] = $scope.menuButtons[u];
          } else {
              editObj["Button" + u] = 'null';
          }
      }

      if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 && $scope.menuMsg.length>0 && $scope.menuMsg.length<640) {
          $scope.showChangeMenuSaveLoader = true;
          $http({
                  method: 'PUT',
                  url: plugApiService.getApi('getAllApi') + '/action',
                  data: editObj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                if(response.errorMessage){
                  $scope.showChangeMenuSaveLoader = false;
                  alertService.addAlert("Problem updating the menu.Please try again later.", "err");
                }else{
                  // editObj["status"] = $scope.getStatusOfAction(editObj["ActionID"]);
                  for (var i = 0; i < $scope.all.length; i++) {
                      for (var j = 0; j < $scope.all[i].actions.length; j++) {
                          if (editObj["ActionID"] == $scope.all[i].actions[j].ActionID) {
                              $scope.updateMenuItemData(editObj);
                          }
                          $scope.showChangeMenuSaveLoader = false;
                          $scope.showMenuSavedLabel = true;
                          setTimeout(function() {
                              $scope.showMenuSavedLabel = false;
                          }, 1000);
                      }
                  }

                  alertService.addAlert("successfully updated " + editObj.ActionName + " in " + actionsAndCategoriesService.getCategoryNameById(editObj.CategoryID) + " Group", "succ");

                  var flag = true;
                  // for (var uc = 0; uc < $scope.menuButtons.length; uc++) {
                  //     if (flag) {
                  //         if (Object.keys($scope.menuButtons[uc]).indexOf('actions') == -1) {
                  //
                  //         } else {
                  //             if ($scope.isActionPresent($scope.menuButtons[uc].actions[0].ActionID) && $scope.getStatusOfAction($scope.menuButtons[uc].actions[0].ActionID) == 'active') {
                  //                 flag = true;
                  //             } else {
                  //                 flag = false;
                  //                 $scope.setStatusOfAction(editObj["ActionID"], "inactive");
                  //                 $scope.inactivateParentsOfAction(editObj["ActionID"]); //Actually inactivation
                  //             }
                  //         }
                  //         if (uc == $scope.menuButtons.length - 1) {
                  //             if (flag == true) {
                  //                 $scope.setStatusOfAction(editObj["ActionID"], "active");
                  //                 $scope.activateParentsOfAction(editObj["ActionID"]);
                  //             }
                  //         }
                  //     }
                  // }
                }
              });

      }
  };

  $scope.updateMenuItemData = function(obj) {
      for (var i = 0; i < $scope.all.length; i++) {
          for (var j = 0; j < $scope.all[i].actions.length; j++) {
              if ($scope.activeActionId == $scope.all[i].actions[j].ActionID) {
                  $scope.all[i].actions[j] = obj;
                  actionsAndCategoriesService.setActionsAndCategries($scope.all);
                  $rootScope.$broadcast('updateActionsAndCategories');
              }
          }
      }
  };


}]);

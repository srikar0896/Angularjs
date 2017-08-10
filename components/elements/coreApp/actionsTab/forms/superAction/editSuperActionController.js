var app = angular.module('plugApp');

app.controller('editSuperActionController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService){

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

  $("#editSuperActions").chosen({
      max_selected_options: 3
  });

  $rootScope.$on("openForm", function(event,data){
    if(data.formName == 'editSuperActionForm'){
      $scope.openEditSuperActionForm();
    }
  });

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.openEditSuperActionForm = function(){
    $scope.deletedActions = [];
    var inactiveActions = [];
    var deletedActionsCount = 0;
    var actId = actionsAndCategoriesService.getActiveActionId();
    var catId = actionsAndCategoriesService.getSelectedCategory();
    if (actId && catId && $scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) {
        for (var i = 0; i < $scope.all.length; i++) {
            if (catId == $scope.all[i].CategoryID) {
                for (var j = 0; j < $scope.all[i].actions.length; j++) {
                    if (actId == $scope.all[i].actions[j].ActionID) {
                      $scope.actionName = $scope.all[i].actions[j].ActionName;
                      if (Object.keys($scope.all[i].actions[j]).indexOf('Shortcut') >= 0) {
                          $scope.actionShortcut = $scope.all[i].actions[j].Shortcut.substr(2).trim();
                      } else {
                        $scope.actionShortcut = '';
                      }
                        var superActionId = '';
                        var superActionIdArr = [];
                        var flag = true;
                        for (var c = 0; c < 3; c++) {
                            if ($scope.all[i].actions[j]["Action" + c] != 'null') {
                                superActionId = $scope.all[i].actions[j]["Action" + c].ActionID;
                                superActionIdArr.push(superActionId);
                                if (actionsAndCategoriesService.isActionPresent(superActionId)) {

                                } else {
                                    var obj = {};
                                    obj["value"] = superActionId;
                                    obj["name"] = $scope.all[i].actions[j]["Action" + c].ActionName;
                                    $scope.deletedActions.push(obj);
                                    $('#editSuperActions').trigger('liszt:updated');
                                }
                            }
                        }
                        $("#editSuperActions").chosen().val(superActionIdArr).trigger('chosen:updated');

                    }
                }
            }
        }

    }
  };

  $scope.updateSuperAction = function(){
    var editName = $scope.actionName;
    var editSrct = $scope.getShortcutForAction('//' + $scope.actionShortcut);
    var editSuperActions = $('#editSuperActions').getSelectionOrder();
    if (editSuperActions && editSuperActions.length > 0 && ($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10) {

        for (var i = 0; i < $scope.all.length; i++) {
            if ($scope.activeSuperActCat == $scope.all[i].Name) {
                cat_Id = $scope.all[i].CategoryID;
            }
        }
        var editObj = {
            "PageID": $scope.selectedPage.page_id,
            "CategoryID": actionsAndCategoriesService.getSelectedCategory(),
            "ActionID": actionsAndCategoriesService.getActiveActionId(),
            "ActionName": editName,
            "Shortcut":editSrct,
            "Type": 'superaction'
        };

        for (var i = 0; i < 3; i++) {
            if (i < editSuperActions.length) {
                var obj = {};
                if (actionsAndCategoriesService.isActionPresent(editSuperActions[i])) {
                    obj["ActionName"] = actionsAndCategoriesService.getActionNameById(editSuperActions[i]);
                    obj["ActionID"] = editSuperActions[i];
                } else {
                    alertService.addAlert("Seems like this action is not avilable. Please choose valid Action.", "err");
                }
                editObj["Action" + i] = obj;

            } else {
                editObj["Action" + i] = 'null';

            }
        }
        var z = Object.values(editObj);
        // $scope.actsInSuperActs = $scope.actsInSuperActs.concat(z);
        if (editName) {
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
                  $scope.showViewLoader = false;
                  $scope.showSavedLabel = true;
                  setTimeout(function() {
                      $scope.showSuperSavedLabel = false;

                  }, 1000);
                    // editObj["status"] = $scope.getStatusOfAction(editObj["ActionID"]);
                    alertService.addAlert("Successfully updated " + editObj.ActionName + " action.", "succ");
                    for (var i = 0; i < $scope.all.length; i++) {
                        for (var j = 0; j < $scope.all[i].actions.length; j++) {
                            if ($scope.activeActionId == $scope.all[i].actions[j].ActionID) {
                                //$scope.all[i].actions[j] = editObj;
                                $scope.updateSuperActionItemData(editObj)
                                for (var x = 0; x < editSuperActions.length; x++) {
                                    if (editSuperActions[x] == 'null') {
                                        editSuperActions.splice(x, 1);
                                    }
                                }
                                $("#editSuperActions").chosen().val(editSuperActions).trigger('chosen:updated');
                              }
                        }
                    }
                    var flag = true;
                    // for (var uc = 0; uc < editSuperActions.length; uc++) {
                    //     if (flag) {
                    //         if (actionsAndCategoriesService.isActionPresent(editSuperActions[uc]) && $scope.getStatusOfAction(editSuperActions[uc]) == 'active') {
                    //             flag = true;
                    //         } else {
                    //             flag = false;
                    //             //$scope.setStatusOfAction(editObj["ActionID"], "inactive");
                    //         }
                    //
                    //         if (uc == editSuperActions.length - 1) {
                    //             if (flag == true) {
                    //                 //$scope.setStatusOfAction(editObj["ActionID"], "active");
                    //                 //$scope.activateParentsOfAction(editObj["ActionID"]);
                    //             }
                    //         }
                    //     }
                    // }
                    //
                });

        }

    } else {

        alertService.addAlert("Please select atleast one action.", "notice");

    }
  };

  $scope.updateSuperActionItemData = function(obj) {
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

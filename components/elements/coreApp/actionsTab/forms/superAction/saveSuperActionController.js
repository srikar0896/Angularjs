var app = angular.module('plugApp');

app.controller('saveSuperActionController',[
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
    if(data.formName == 'saveSuperActionForm'){
      $scope.openSaveSuperActionForm();
    }
  });

  $("#superActions").chosen({
      max_selected_options: 3
  });

$scope.openSaveSuperActionForm = function(){
  $scope.selectedCatName = actionsAndCategoriesService.getCategoryNameById(actionsAndCategoriesService.getSelectedCategory());
  $scope.actionName = ''
  $("#superActions").chosen().val('').trigger('chosen:updated');
  $scope.actionShortcut = '';
};

$scope.getShortcutForAction = function(x) {
    if (x.length > 2) {
        return x.toLowerCase();
    } else {
        return '-1';
    }
};

$scope.saveSuperAction = function() {
    var catId = actionsAndCategoriesService.getSelectedCategory();
    var superName = $scope.actionName;
    var superSrt = $scope.getShortcutForAction("//" + $scope.actionShortcut);
    var superActionss = $("#superActions").getSelectionOrder();
    if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 ) {
        $scope.showSaveLoader = true;
        var newAction = {
            CategoryID: catId,
            PageID: $scope.selectedPage.page_id,
            ActionName: capitalizeService.capitalizeFirstLetter(superName),
            Notes: 'null',
            Shortcut:superSrt,
            Type: "superaction"
        };
        var superLen = superActionss.length;
        for (var i = 0; i < 3; i++) {
            if (i < superLen) {
                var obj = {};
                obj["ActionID"] = superActionss[i];
                obj["ActionName"] = actionsAndCategoriesService.getActionNameById(superActionss[i]);
                newAction["Action" + i] = obj;
            } else {
                newAction["Action" + i] = 'null';
            }
        }
        $http({
                method: 'POST',
                url: plugApiService.getApi('getAllApi') + '/action',
                data: newAction,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(response) {
                alertService.addAlert("successfully updated " + newAction.ActionName + " in " + actionsAndCategoriesService.getCategoryNameById(newAction.CategoryID) + " group", "succ");
                if (response.ActionID) {
                    $scope.showSaveLoader = false;
                    for (var x = 0; x < $scope.all.length; x++) {
                        if (newAction.CategoryID == $scope.all[x].CategoryID) {
                            newAction["ActionID"] = response.ActionID;
                            $scope.all[x].actions.push(newAction);
                            actionsAndCategoriesService.setActionsAndCategries($scope.all);
                            $rootScope.$broadcast('updateActionsAndCategories');
                            var data = {};
                            data["actId"] = response.ActionID;
                            data["catId"] = newAction.CategoryID;
                            $rootScope.$broadcast('viewAction',data);
                        }
                    }
                } else {
                  alertService.addAlert("Unable to Create an action.Please try again later.","err");
                    $scope.showSaveLoader = false;
                }
            });

    } else {
        alertService.addAlert("Please select atleast one action.", "notice");
    }

};

}]);

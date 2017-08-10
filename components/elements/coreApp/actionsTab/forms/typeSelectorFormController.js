var app = angular.module('plugApp');

app.controller('typeSelectorFormController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService){


  $scope.actionType = function(x) {
    $rootScope.$broadcast('closeForm');
      $scope.selectedType = x;
      var obj={};
      if (x == 'text') {
        obj={};
        obj["formName"] = 'saveTextForm';
        $rootScope.$broadcast("openForm",obj);
      }
      if (x == 'superaction') {
        obj={};
        obj["formName"] = 'saveSuperActionForm';
        $rootScope.$broadcast("openForm",obj);
      }
      if (x == 'menu') {
        obj={};
        obj["formName"] = 'saveMenuForm';
        $rootScope.$broadcast("openForm",obj);
      }
      if (x == 'image') {
        obj={};
        obj["formName"] = 'saveImageForm';
        $rootScope.$broadcast("openForm",obj);
      }
  };

}]);

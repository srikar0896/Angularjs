var app = angular.module('plugApp');

app.controller('alertsController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','$timeout',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService, $timeout){

    $scope.$on('showAlertBar', function(event, data){
            $scope.alert = data;
            $scope.showAlertBar = true;
            $scope.timePromise = $timeout(function() {
                $scope.closeAlert();
            }, 2500);
        });
    $scope.closeAlert = function(){
      $scope.showAlertBar = false;
    };
}]);

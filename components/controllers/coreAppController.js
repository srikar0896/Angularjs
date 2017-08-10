var app = angular.module('plugApp');

app.controller('coreAppController',['$state','$uibModal','$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
function($state, $uibModal, $rootScope, $scope, $http, cacheService, plugApiService , fbPagesService){

  $scope.userEmail = cacheService.getLoginData().userEmail;
  $scope.userName = cacheService.getLoginData().userName;

  if(typeof $scope.userEmail !== 'undefined'
      && typeof $scope.userName !== 'undefined'
      && !(!$scope.userEmail || !$scope.userName)){
      $http({
              method: 'GET',
              url: plugApiService.getApi('getPagesApi') + $scope.userName + "&email=" + $scope.userEmail,

              headers: {
                  'Content-Type': 'application/json',
                  "X-Api-Key": "u5FocU4xLq2rBfZ1ZSV8o81R2usYzUEM3NaCinnV",
                  "Access-Control-Request-Headers": "X-Api-Key",
                  "Access-Control-Request-Method": "GET"
              }
          })
          .success(function(response) {
            fbPagesService.setPages(response);
            $rootScope.$broadcast("openPageSelectionModal");
          });
    }else{
      $state.go("login");
    }

}]);

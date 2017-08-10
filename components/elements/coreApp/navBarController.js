var app = angular.module('plugApp');
app.controller('navBarController',['$uibModal','$rootScope', '$scope','$http','cacheService','plugApiService','fbPagesService','$state',
function($uibModal,$rootScope, $scope, $http, cacheService, plugApiService , fbPagesService,$state){

  /* Handle function in nav bar here */
  $scope.activePanel = 'chatPanel';
  $scope.selectedPageName = '';

  $scope.openPageSelectionModal = function(){
    $rootScope.$broadcast("openPageSelectionModal");
  };

  $rootScope.$on("updatePageContent", function(){
    $scope.updateNavBar();
  });

  $scope.updateNavBar = function(){
      $scope.selectedPageName = fbPagesService.getSelectedPage().name;
  };

  $scope.logout = function(){
      $state.go("logout");
      cacheService.removeUserData();
  };

}]);

var app = angular.module('plugApp');

app.controller('editFormSideBarController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','menuService','messengerProfileService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,menuService,
  messengerProfileService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';
  $scope.all=[];

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
  });

  $scope.showUsage = function(){
      $rootScope.$broadcast('openButtonForm',{'formName':'usageForm'});
  };

  $scope.addNotes = function(){
    $rootScope.$broadcast('openButtonForm',{'formName':'addNotesForm'});
  };

}]);

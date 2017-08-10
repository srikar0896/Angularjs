var app = angular.module('plugApp');

app.controller('fbPageSelectionModalController',['$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
function($uibModal, $rootScope,$scope, $http, cacheService, plugApiService , fbPagesService){
  $('select').chosen();
  $scope.fbPages = [];
  var fbPagesModal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/fbPageSelection',
        scope: $scope,
        keyboard:false
      });
  };

  $scope.openPageSelectionModal = function(){
      $scope.fbPages = fbPagesService.getPages().pages;
      fbPagesModal().result
        .then(function(){
               console.log("result function");
             });
    };
  $scope.selectPage = function(){
  $scope.modalInstance.dismiss('No Button Clicked');
    var selectedPage = $("#pageSelectionDropDown").chosen().val();
    fbPagesService.setSelectedPage(selectedPage);
    $scope.subscribeToPlug(fbPagesService.getSelectedPage().page_id);
    $scope.updatePageContent();

  };

  $scope.subscribeToPlug = function(id) {
      $http({
              method: 'GET',
              url: plugApiService.getApi('subscribeToAppApi') + id + "&name=" + cacheService.getLoginData().userName + "&email=" + cacheService.getLoginData().userEmail,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(function(response) {
              console.log(response);
          });

  };

  $scope.updatePageContent = function(){
    $rootScope.$broadcast("updatePageContent");
  };

  $scope.cancel = function(){
    //write code if you want to handle the event of closing modal.
  };

  $rootScope.$on("openPageSelectionModal", function(){
    $scope.openPageSelectionModal();
  });
}]);

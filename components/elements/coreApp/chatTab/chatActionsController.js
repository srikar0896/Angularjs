var app = angular.module('plugApp');

app.controller('chatActionsController',['$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService','timeService',
'actionsAndCategoriesService',function($uibModal, $rootScope, $scope, $http, cacheService, plugApiService , fbPagesService ,timeService,actionsAndCategoriesService){
  $scope.userData = cacheService.getLoginData();

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.setAll();
    });

  $scope.returnType = function(x) {
      if (x == "text") {
          return "icon-comment";
      }
      if (x == 'image') {
          return "icon-image"
      }
      if (x == 'video') {
          return "icon-video-camera"
      }
      if (x == 'superaction') {
          return "fa-bolt"
      }
      if (x == 'menu') {
          return "fa-stack-exchange"
      }
  };

  $scope.showToasterMessage = function(actId,srt){
  var obj = {};
  obj["actId"] = actId;
  obj["srt"] = srt;
  $rootScope.$broadcast("showToaster",obj);
  };

  $scope.setAll = function() {
      $scope.all = [];
      $scope.actionLoader = true;
      $http.get(plugApiService.getApi('getAllApi') + '/all?pageid=' + $scope.selectedPage.page_id)
          .then(function(response) {
              $scope.actionLoader = false;
              // $scope.changingPage = false;
              $scope.all = response.data;
              actionsAndCategoriesService.setActionsAndCategries(response.data);
              $rootScope.$broadcast("updateActionsAndCategories");
              // menuService.setAllObj($scope.all);
              // var count = 0;
              //
              // $scope.catIds = [];
              // $scope.actionIDS = [];
              // for (var i = 0; i < $scope.all.length; i++) {
              //     $scope.catIds.push($scope.all[i].CategoryID);
              //     for (var j = 0; j < $scope.all[i].actions.length; j++) {
              //         $scope.actionIDS.push($scope.all[i].actions[j].ActionID);
              //         $scope.all[i].actions[j]["status"] = "active";
              //         if (Object.keys($scope.all[i].actions[j]).indexOf('Shortcut') < 0) {
              //             $scope.noSrtActs.push($scope.all[i].actions[j].ActionID);
              //             count++;
              //         }
              //     }
              // }
              //
              // for (var x = 0; x < $scope.all.length; x++) {
              //     for (var y = 0; y < $scope.all[x].actions.length; y++) {
              //         if ($scope.all[x].actions[y].Type == 'superaction') {
              //             var z = Object.values($scope.all[x].actions[y]);
              //             $scope.actsInSuperActs = $scope.actsInSuperActs.concat(z);
              //         }
              //     }
              // }
              // if ($scope.all.length > 0) {
              //     $scope.activeForm = 'noActionSelected';
              // }
              // console.log($scope.all);
              //
              // setTimeout(function() {
              //     $scope.updateElements();
              // }, 2000);
          });
  };

}]);

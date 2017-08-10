var app = angular.module('plugApp');

app.controller('pubnubController',['$uibModal', '$rootScope','$scope','$http','cacheService',
'plugApiService','fbPagesService','alertService','actionsAndCategoriesService',
function($uibModal, $rootScope,$scope, $http, cacheService, plugApiService , fbPagesService ,
alertService, actionsAndCategoriesService){
  $scope.all = [];

  $scope.pubnub = PUBNUB.init({
      publish_key: 'pub-c-a97f9f51-aedf-46ce-8006-051a05e502b8',
      subscribe_key: 'sub-c-ec403f8c-8fa8-11e6-a68c-0619f8945a4f',
      ssl: (('https:' == document.location.protocol) ? true : false),
      error: function(error) {
          // Error Handling.
          alertService.addAlert("Something Wrong in Pubnub notification service", "err");
      }
  });

  $scope.temp_page_id = '0';

  $rootScope.$on("updatePageContent", function(){
    $scope.closeChannel($scope.temp_page_id);
    var page_id = fbPagesService.getSelectedPage().page_id;
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $scope.setPubnub(page_id);
    $scope.temp_page_id = page_id;
  });

  $scope.closeChannel = function(id) {
    if(id!='0'){
      if (id && typeof(id) !== 'undefined') {
          $scope.pubnub.unsubscribe({
              channel: id,
          });
          $scope.pubnub.unsubscribe({
              channel: id + ":action",
          });

          $scope.pubnub.unsubscribe({
              channel: id + ":action:delete",
          });

          $scope.pubnub.unsubscribe({
              channel: id + ":updateAction",
          });

          $scope.pubnub.unsubscribe({
              channel: id + ":category",
          });

          $scope.pubnub.unsubscribe({
              channel: id + ":category:delete",
          });
      } else {
          alertService.addAlert("Something went wrong.", "err");
      }

    }
  };
  $scope.setPubnub = function(page_id) {

    /*pubnub message notification*/
      $scope.pubnub.subscribe({
          channel: page_id,
          message: function(msgObj) {
              console.log(msgObj);
              $rootScope.$emit("updateTimelineMessageContent",msgObj);
          },
          error: function(error) {
          }
      });

    /*pubnub New Action notification*/
      $scope.pubnub.subscribe({
          channel: page_id + ":action",
          message: function(m) {
              $scope.getNewAction(m.ActionID,page_id);
          },
          error: function(error) {
          }
      });

     /*pubnub Delete Action notification*/
      $scope.pubnub.subscribe({
          channel: page_id + ":action:delete",
          message: function(m) {
              $scope.deleteAction(m.ActionID);
          },
          error: function(error) {
          }
      });

       /*pubnub notification for action update*/
      $scope.pubnub.subscribe({
          channel: page_id + ":updateAction",
          message: function(m) {
              $scope.updateAction(m.ActionID,page_id);
          },
          error: function(error) {
          }
      });

     /*pubnub notification for new category*/
      $scope.pubnub.subscribe({
          channel: page_id + ":category",
          message: function(m) {
              $scope.getNewCategory(m.CategoryID,page_id);
          },
          error: function(error) {
          }
      });

     /*pubnub notification for delete category*/
      $scope.pubnub.subscribe({
          channel: page_id + ":category:delete",
          message: function(m) {
              $scope.deleteCategory(m.CategoryID);
          },
          error: function(error) {
              // Handle error here
          }
      });

   /*Unread Count*/
  /*    $scope.pubnub.subscribe({
          channel: page_id + ":unread",
          message: function(m) {
              $scope.unreadMessageDetails[m.user_id] = 0;
          },
          error: function(error) {
              // Handle error here
          }
      });
  */

  };

  $scope.getNewAction = function(actId,pageId) {
      $http.get(plugApiService.getApi('getAllApi') + '/action?pageid=' + pageId + "&actionid=" + actId)
          .then(function(response) {
            actionsAndCategoriesService.addNewAction(response.data);
            $rootScope.$broadcast("updateActionsAndCategories");
              for (var i = 0; i < $scope.all.length; i++) {
                  if (response.data.CategoryID == $scope.all[i].CategoryID) {
                      alertService.addAlert("Added a new Action in "+ $scope.all[i].Name + " Group.","notice");
                      }
                  }
          });
  };

  $scope.deleteAction = function(actId) {
      for (var i = 0; i < $scope.all.length; i++) {
          for (var j = 0; j < $scope.all[i].actions.length; j++) {
              if (actId == $scope.all[i].actions[j].ActionID) {
                  $scope.all[i].actions.splice(j, 1);
                  alertService.addAlert($scope.all[i].actions[j].ActionName + " Action has been deleted by other user.","notice");
                  actionsAndCategoriesService.setActionsAndCategries($scope.all);
                  $rootScope.$broadcast("updateActionsAndCategories");
                  if (actionsAndCategoriesService.getActiveActionId() = $scope.all[i].actions[j].ActionID) {
                      $rootScope.$broadcast("closeForm");
                  }
              }
          }
      }
  };

  $scope.updateAction = function(actId,pageId) {
      $http.get(plugApiService.getApi('getAllApi') + '/action?pageid=' + pageId + "&actionid=" + actId)
          .then(function(response) {
              for (var i = 0; i < $scope.all.length; i++) {
                  if (response.data.CategoryID == $scope.all[i].CategoryID) {
                      for (var j = 0; j < $scope.all[i].actions.length; j++) {
                          if (response.data.ActionID == $scope.all[i].actions[j].ActionID) {
                              $scope.all[i].actions[j] = response.data;
                              alertService.addAlert($scope.all[i].actions[j].ActionName + " Action has been updated by other user.","notice");
                              actionsAndCategoriesService.setActionsAndCategries($scope.all);
                              $rootScope.$broadcast("updateActionsAndCategories");
                              if (actionsAndCategoriesService.getActiveActionId() == response.data.ActionID) {
                                alertService.addAlert("This Action has been updated by other user,reopen this action to see udpates","notice");
                              }
                          }
                      }
                  }
              }
          });
  };

  $scope.getNewCategory = function(catId,pageId) {
    $http.get(plugApiService.getApi('getAllApi') + '/category?pageid=' + pageId + "&categoryid=" + catId) //GET NEW ACTION
          .then(function(response) {
            actionsAndCategoriesService.addNewCategory(response.data);
            alertService.addAlert(response.data.Name + " Group has been added by other user.","notice");
            $rootScope.$broadcast("updateActionsAndCategories");
          });
  };

  $scope.deleteCategory = function(catId) {
      for (var i = 0; i < $scope.all.length; i++) {
          if (catId == $scope.all[i].CategoryID) {
              $scope.all.splice(i, 1);
              if (actionsAndCategoriesService.getSelectedCategory() == catId) {
                  $rootScope.$broadcast("closeForm");
              }
              alertService.addAlert(actionsAndCategoriesService.getCategoryNameById(catId) + " Group has been deleted by other user.","notice");
              actionsAndCategoriesService.setActionsAndCategries($scope.all);
              $rootScope.$broadcast("updateActionsAndCategories");
          }
      }
  };


}]);

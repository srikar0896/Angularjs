var app = angular.module('plugApp');

app.controller('timelineController',['$uibModal', '$rootScope','$scope','$http',
  'cacheService','plugApiService','fbPagesService','timeService','actionsAndCategoriesService',
  function($uibModal, $rootScope, $scope, $http, cacheService, plugApiService ,
  fbPagesService ,timeService,actionsAndCategoriesService){

  $scope.userData = cacheService.getLoginData();

  $scope.activeTab = 'Timeline';
  $scope.timelineItems = [];
  $scope.selectedPage = '';
  $scope.all = [];

  $scope.flushPrevoiusPageData = function(){
    $scope.timelineItems = [];
    $scope.showLoader = false;
    $scope.profileUserNames = [];
    $scope.profilePictures = [];
    $scope.sender_Ids = [];
    $scope.userIds = [];
    $scope.noTimelineContent = true;
    $scope.timelineItems = [];
    $scope.activeUserId = $scope.userIds[0];
  };

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.fetchTimelineContent($scope.selectedPage.page_id);
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });


  $rootScope.$on("updateTimelineMessageContent", function(event,msgObj){
    $scope.updateTimelineMessageContent(msgObj.Date, msgObj.SenderID);
  });

  $scope.getUserNames = function(user_id) {
      return $scope.profileUserNames[user_id];
  };

  $scope.messageIconType = function(kind) {
      if (kind == 'outbound') {
          return 'icon-plug';
      } else {
          return '';
      }
  };

  $scope.getDp = function(id) {

      return $scope.profilePictures[id];
  };

  $scope.convertDate = function(date){
  return  timeService.getTime(date);
  };
  $scope.checkMessageKind = function(x) {
      if (x == 'inbound') {
          return 'From: ';
      }
      if (x == 'outbound') {
          return 'To: ';
      }
  };

  $scope.trimMessage = function(msg) {
      var length = 76;
      var string = msg;
      var trimmedString = string.length > length ? string.substring(0, length - 3) + " ..." : string;
      return trimmedString;
  };

  $scope.fetchTimelineContent = function(page_id){
    $scope.flushPrevoiusPageData();
    $scope.showLoader = true;
    $http.get(plugApiService.getApi('timelineApi') + page_id)
        .then(function(response) {
          $scope.showLoader = false;
            if (response.data.length > 0) {
                var f = 0;
                $scope.noTimelineContent = false;
                response.data.forEach(function(profile) {
                    var tlPosition = $scope.profileUserNames.indexOf(response.data[f].userName);
                    if (tlPosition < 0) {
                        $scope.timelineItems.push(profile);
                        var currentUser = response.data[f].userName;
                        var pic_adr = response.data[f].profile_pic;
                        if (response.data[f].kind == 'inbound') {
                            var sender_id = response.data[f].SenderID;

                        } else {
                            var sender_id = response.data[f].RecipientID;
                        }
                        var date = response.data[f].Date;
                        // //$scope.unreadMessageDetails[sender_id] = response.data[f].unread_count;
                        $scope.userIds.push(response.data[f].userid);
                        $scope.profileUserNames[sender_id] = currentUser;
                        $scope.profilePictures[sender_id] = pic_adr;
                    } else {
                        $scope.timelineItems[tlPosition].Msg = response.data[f].Msg;
                        $scope.timelineItems[tlPosition].Date = response.data[f].Date;
                    }
                    if (f == 0) {
                        $scope.activeUser = currentUser;
                        $scope.updateScrollableChatBox(currentUser, $scope.userIds[0],$scope.selectedPage.page_id, pic_adr, response.data[0].kind);
                        // $scope.itemClicked($scope.userIds[0]);
                    }
                    f++;
                });
                $scope.showLoader = false;
            } else {
                $scope.noTimelineContent = true;

                if ($scope.all.length == 0) {
                    $scope.activeForm = 'instructions';
                    $scope.showInstructions = true;
                }
                $scope.showLoader = false;
                $scope.showchatLoader = false;
            }
        });

  };
$scope.updateScrollableChatBox = function(currentUser,userId,pageId,pic_adr,kind){
  $scope.activeUserId = userId;
  var obj = {};
  obj["currentUser"] = currentUser;
  obj["userId"] = userId;
  obj["pageId"] = pageId;
  obj["pic_adr"] = pic_adr;
  obj["kind"] = kind;
  obj["profileUserNames"] = $scope.profileUserNames;
    $rootScope.$broadcast("updateScrollableChatBox",obj);
};
  $scope.updateTimelineMessageContent = function(date, senderId) {
      var i = 0;
      $http.get(plugApiService.getApi('getNewMessageApi') + date + "&email=" + $scope.userData.userEmail + "&name=" + $scope.userData.userName + "&senderid=" + senderId)
          .then(function(response) {

              var currentUser = response.data.userName;
              var pic_adr = response.data.profile_pic;
              if (response.data.kind == 'outbound') {
                  var userId = response.data.RecipientID;
              } else {
                  var userId = response.data.SenderID;
              }
              var date = response.data.Date;
              var tlPosition = $scope.userIds.indexOf(userId);
              if (tlPosition < 0) {
                  //$scope.unreadMessageDetails[userId] = 1;
                  $scope.profilePictures[userId] = pic_adr;
                  $scope.profileUserNames[userId] = currentUser;
                  if (currentUser) {
                      if (response.errorMessage) {

                      } else {
                          $scope.timelineItems.push(response.data);

                      }
                  }

                  if (response.data.kind == 'inbound')
                      //$scope.unreadMessageDetails[currentUser] = //$scope.unreadMessageDetails[currentUser] + 1;
                      $scope.newMessages = $scope.newMessages + 1;
                      if ($scope.userIds.length == 0) {
                        if (userId) {
                          $scope.userIds.push(userId);
                        }
                       $scope.updateScrollableChatBox(currentUser, $scope.userIds[0], $scope.pageId, pic_adr, response.data.kind);
                  } else {
                      if (userId) {
                          $scope.userIds.push(userId);
                      }
                  }

              } else {
                  if (response.data.kind == 'inbound')
                      //$scope.unreadMessageDetails[userId] = //$scope.unreadMessageDetails[userId] + 1;
                  if (response.data.Type == 'text') {
                      $scope.timelineItems[tlPosition].Msg = response.data.Msg;

                  }
                  $scope.timelineItems[tlPosition].Type = response.data.Type;
                  $scope.timelineItems[tlPosition].Date = response.data.Date;
                  $scope.timelineItems[tlPosition].kind = response.data.kind;
                  if (userId == $scope.activeUserId) {
                      if (response.data.kind == 'inbound') {
                          console.log("INBOUND");
                          var xy = {
                              'Date': response.data.Date,
                              'Msg': response.data.Msg,
                              'kind': response.data.kind
                          };

                          $scope.addNewMessage(response.data);
                          // $scope.scrollableChatItems.push(response.data);
                          //$scope.unreadMessageDetails[userId] = 0;

                      }
                      if (response.data.kind == 'outbound' && (response.data.plug_user_name == $scope.user)) {
                          $scope.timelineItems[tlPosition] = response.data;

                      }
                      if (response.data.kind == 'outbound' && (response.data.plug_user_name != $scope.user)) {
                                                        if (response.data.Type == 'text') {
                              $scope.timelineItems[tlPosition].Msg = response.data.Msg;
                          }
                          $scope.timelineItems[tlPosition].Type = response.data.Type;
                          $scope.timelineItems[tlPosition].Date = response.data.Date;
                          $scope.timelineItems[tlPosition].kind = response.data.kind;
                          // $scope.scrollableChatItems.push(response.data);
                          $scope.addNewMessage(response.data);

                      }
                  }
              }

              i++;


          });
  };

$scope.addNewMessage = function(obj){
  $rootScope.$broadcast("addNewMessage",obj);
};

}]);

var app = angular.module('plugApp');

app.controller('chatBoxController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';

  $scope.scrollableChatItems = [];
  $scope.showchatLoader = false;
  $scope.activeUser = 'INBOX';
  $scope.all = [];
  $scope.activeToaster = '';
  $scope.CategoryIDs = [];
  $scope.actionIDS = [];
  $scope.message = '';

  /*autogrow config*/
  
  $('.messageInput').autogrow({
      vertical: true,
      horizontal: false
  });

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.scrollableChatItems = [];
    $scope.activeUser = 'INBOX';
    $scope.all = [];
    $scope.activeToaster = '';
    $scope.CategoryIDs = [];
    $scope.actionIDS = [];
    $scope.message = '';
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.categoryIDS = [];
    $scope.actionIDS = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    for (var i = 0; i < $scope.all.length; i++) {
        $scope.categoryIDS.push($scope.all[i].CategoryID);
        for (var j = 0; j < $scope.all[i].actions.length; j++) {
            $scope.actionIDS.push($scope.all[i].actions[j].ActionID);
        }
    }
  });


$rootScope.$on("updateScrollableChatBox", function(event,obj){
  $scope.updateScrollableChatBox(obj.currentUser,obj.userId,obj.pageId,obj.pic_adr,obj.kind,obj.profileUserNames);
  });

$rootScope.$on("addNewMessage", function(event,obj){
    if(obj.SenderID!= $scope.selectedPage.page_id && obj.kind!= 'outbound'){
      $scope.scrollableChatItems.push(obj);
    }
  });

  $rootScope.$on("updatePageContent", function(){
  $scope.scrollableChatItems = [];
    });

  $rootScope.$on("showToaster", function(event,args){
    $scope.showToasterMessage(args.actId,args.srt);
    });

$scope.updateScrollableChatBox = function(externalUserName, userid, pageid, dp, kind,userNames) {
    $scope.selectedIndex = userid;
    $scope.showchatLoader = true;
    $scope.scrollableChatItems = [];
    $scope.activeToaster = '';
    $("#messageInput").val('');
    $scope.activeUserId = userid;
    $scope.pageId = pageid;
    $scope.profileUserNames = userNames;

    $scope.activeUser = $scope.profileUserNames[$scope.activeUserId];
    $scope.active_user_picture = dp;
    $http.get("https://zpowm1j4aj.execute-api.us-east-1.amazonaws.com/prod?pageid=" + $scope.pageId + "&senderid=" + $scope.activeUserId) //CHAt Api JSON

        .then(function(response) {
            $scope.scrollableChatItems = response.data;
            for (var i = 0; i < $scope.scrollableChatItems.length; i++) {
                if ($scope.scrollableChatItems[i].plug_user_email == $scope.userData.userEmail) {

                }
            }
            // $scope.unreadMessageDetails[userid] = 0;
            $scope.showchatLoader = false;
        });
};

$scope.messageKind = function(kind) {
    if (kind == "outbound") {
        return "float-right";
    } else {
        return "float-left";
    }
};

$scope.onImgLoadForToaster = function(event) {
    $scope.imageLoaderForToaster = false;
};

$scope.arrowSide = function(kind) {
    if (kind == "outbound") {
        return "left";
    } else {
        return "right";
    }
};

$scope.convertDate = function(date){
return  timeService.getTime(date);
};

$scope.checkShortCut = function(x) {

    if (x.message.match("^//")) {

        for (var i = 0; i < $scope.all.length; i++) {
            for (var j = 0; j < $scope.all[i].actions.length; j++) {
                if (x.message.slice(-1) == " ") {

                    if ($scope.hasShortcut(i, j) == true) {
                        if (x.message.toLowerCase().substring(0, x.message.length - 1).trim() == $scope.all[i].actions[j].Shortcut.toLowerCase().trim()) {
                            if ($scope.all[i].actions[j].Type == 'text') {

                                $scope.textToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.activeToaster = 'showTextToaster';
                                $scope.showToaster($scope.all[i].actions[j].ActionID);
                                $scope.activeSrt = x.message;

                            }

                            if ($scope.all[i].actions[j].Type == 'superaction') {
                                $scope.activeToaster = 'superPillsToaster';
                                $scope.superToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.toasterSuperPills = [];
                                var action = {};
                                for (var c = 0; c < 3; c++) {
                                    if ($scope.all[i].actions[j]["Action" + c] == 'null') {} else {
                                        if ($scope.actionIDS.indexOf($scope.all[i].actions[j]["Action" + c].ActionID) > -1) {
                                            action["actionId"] = $scope.all[i].actions[j]["Action" + c].ActionID;
                                            action["actionName"] = actionsAndCategoriesService.getActionNameById($scope.all[i].actions[j]["Action" + c].ActionID);
                                            $scope.toasterSuperPills.push(action);
                                        }

                                    }
                                }
                            }
                            if ($scope.all[i].actions[j].Type == 'image') {
                                $scope.imageToasterTitle = $scope.all[i].actions[j].ActionName;
                                $scope.activeToaster = 'imageToaster';
                                $scope.imageLoaderForToaster = true;
                                $scope.imageToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.toasterImageSrc = $scope.all[i].actions[j].plugURL;

                            }
                            if ($scope.all[i].actions[j].Type == 'menu') {

                                $scope.activeToaster = 'menuToaster';
                                $scope.menuToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.menuToasterTitle = $scope.all[i].actions[j].MenuTitle;
                                $scope.menuToasterBtns = [];

                                for (var f = 0; f < 3; f++) {
                                    if ($scope.all[i].actions[j]["Button" + f] != 'null') {

                                        $scope.menuToasterBtns.push($scope.all[i].actions[j]["Button" + f]);

                                    }
                                }
                                $scope.timer = setTimeout(function() {
                                    $scope.closeMenuToaster();
                                }, 25000);
                            }
                        }
                    }
                }
            }
        }
    }
};

$scope.showToaster = function(id) {
    clearTimeout($scope.timer);
    $scope.activeToaster = 'showTextToaster';
    for (var i = 0; i < $scope.all.length; i++) {
        for (var j = 0; j < $scope.all[i].actions.length; j++) {
            if (id == $scope.all[i].actions[j].ActionID) {
                var mes = $scope.all[i].actions[j].Message;
                var srt = $scope.all[i].actions[j].Shortcut;
                $(".messageInput").val(srt);
            }

        }
    }
    $scope.textToasterMessage = mes;
    $scope.textToasterId = id;
    $scope.textToasterMessage = mes;
    $scope.timer = setTimeout(function() {
        $scope.closeToaster();
        $scope.closeSuperPillsToaster();
    }, 25000);
};

$scope.hasShortcut = function(x, y) {
    for (var i = 0; i < $scope.all.length; i++) {
        if (i == x) {
            for (var j = 0; j < $scope.all[i].actions.length; j++) {
                if (j == y) {

                    if (Object.keys($scope.all[i].actions[j]).indexOf('Shortcut') > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }

            }

        }

    }
};

$scope.handleKeyPress = function(keyEvent) {
    if (keyEvent.which == 13 && $scope.message.length>0) {
        var inptVal = $scope.message.toLowerCase();
        keyEvent.preventDefault();
        if (inptVal.match("^//")) {
            for (var i = 0; i < $scope.all.length; i++) {
                for (var j = 0; j < $scope.all[i].actions.length; j++) {
                    if ($scope.hasShortcut(i, j) == true) {
                        if (inptVal.trim() == $scope.all[i].actions[j].Shortcut) {
                            if ($scope.all[i].actions[j].Type == 'text') {
                                if ($scope.textToasterId == $scope.all[i].actions[j].ActionID) {
                                    $scope.publishMessage($scope.all[i].actions[j].ActionID);
                                    $scope.textToasterId = '';
                                } else {
                                    $scope.textToasterId = $scope.all[i].actions[j].ActionID;
                                    $scope.activeToaster = 'showTextToaster';
                                    $scope.showToaster($scope.all[i].actions[j].ActionID);
                                    $scope.activeSrt = inptVal;
                                }
                            }
                            if ($scope.all[i].actions[j].Type == 'image') {
                                if ($scope.imageToasterId == $scope.all[i].actions[j].ActionID) {
                                    $scope.publishImage($scope.all[i].actions[j].ActionID);
                                    $scope.imageToasterId = '';
                                } else {
                                    $scope.imageToasterId = $scope.all[i].actions[j].ActionID;
                                    $scope.imageToasterTitle = $scope.all[i].actions[j].ActionName;
                                    $scope.activeToaster = 'imageToaster';
                                    $scope.imageLoaderForToaster = true;
                                    $scope.toasterImageSrc = $scope.all[i].actions[j].plugURL;
                                    $scope.activeSrt = inptVal;
                                }
                            }
                            if ($scope.all[i].actions[j].Type == 'superaction') {

                                if ($scope.superToasterId == $scope.all[i].actions[j].ActionID) {
                                    $scope.sendSuperToaster();
                                    $scope.superToasterId = '';
                                } else {
                                    $scope.activeToaster = 'superPillsToaster';
                                    $scope.superToasterId = $scope.all[i].actions[j].ActionID;
                                    var action = {};
                                    var srt = $scope.all[i].actions[j].Shortcut;
                                    $scope.toasterSuperPills = [];
                                    for (var c = 0; c < 3; c++) {
                                        if ($scope.all[i].actions[j]["Action" + c] == 'null') {

                                        } else {
                                            if ($scope.actionIDS.indexOf($scope.all[i].actions[j]["Action" + c].ActionID) > -1) {
                                              action["actionId"] = $scope.all[i].actions[j]["Action" + c].ActionID;
                                              action["actionName"] = actionsAndCategoriesService.getActionNameById($scope.all[i].actions[j]["Action" + c].ActionID);
                                                $scope.toasterSuperPills.push(action);
                                            }
                                        }
                                    }
                                    $scope.timer = setTimeout(function() {
                                        $scope.closeSuperPillsToaster();
                                    }, 25000);
                                }
                            }
                            if ($scope.all[i].actions[j].Type == 'menu') {

                                if ($scope.menuToasterId == $scope.all[i].actions[j].ActionID) {
                                    $scope.sendMenuToaster();
                                    $scope.menuToasterId = '';
                                } else {

                                    $scope.activeToaster = 'menuToaster';
                                    $scope.menuToasterId = $scope.all[i].actions[j].ActionID;

                                    $scope.menuToasterTitle = $scope.all[i].actions[j].MenuTitle;
                                    $scope.menuButtonsNum = Object.keys($scope.all[i].actions[j]).length - 8;

                                    $scope.menuToasterBtns = [];

                                    for (var f = 0; f < 3; f++) {

                                        if ($scope.all[i].actions[j]["Button" + f] != 'null') {

                                            $scope.menuToasterBtns.push($scope.all[i].actions[j]["Button" + f]);

                                        }
                                    }
                                    $scope.timer = setTimeout(function() {
                                        $scope.closeMenuToaster();
                                    }, 25000);
                                }
                            }
                        }

                    }
                }
            }
        } else {
            var multipleMessages = []
            multipleMessages = inptVal.match(/.{1,320}/g);
            for (var b = 0; b < multipleMessages.length; b++) {
                $scope.publishMessage(multipleMessages[b]);
                setTimeout(function() {
                    $scope.closeSuperPillsToaster();
                }, 500);
            }
        }
    }
};

$scope.sendMenuToaster = function() {
    if ($scope.menuToasterId) {
        $scope.menuObject = {
            "SenderID": $scope.selectedPage.page_id,
            "PageID": $scope.selectedPage.page_id,
            "RecipientID": $scope.activeUserId,
            "kind": "outbound",
            "Type": "menu",
            "Date": Date.now().toString(),
            'plug_profile_pic': $scope.userData.userDP,
            "plug_user_email": $scope.userData.userEmail,
            "plug_user_name": $scope.userData.userName
        };
        var check = '';
        for (var i = 0; i < $scope.all.length; i++) {
            for (var j = 0; j < $scope.all[i].actions.length; j++) {
                if ($scope.menuToasterId == $scope.all[i].actions[j].ActionID) {
                    var menuTitle = $scope.all[i].actions[j].MenuTitle;
                    $scope.menuObject["menuTitle"] = menuTitle;
                    $scope.menuObject["buttons"] = [];
                    for (var x = 0; x < 3; x++) {
                        if ($scope.all[i].actions[j]["Button" + x] != 'null') {
                            var id = "";
                            var y = {};
                            y["title"] = $scope.all[i].actions[j]["Button" + x].Name;
                            if ($scope.all[i].actions[j]["Button" + x].type == 'phone_number') {
                                y["payload"] = $scope.all[i].actions[j]["Button" + x].payload;
                                y["type"] = "phone_number";

                            }
                            if ($scope.all[i].actions[j]["Button" + x].type == 'web_url') {
                                y["url"] = $scope.all[i].actions[j]["Button" + x].url;
                                y["type"] = "web_url";;
                            }
                            if (Object.keys($scope.all[i].actions[j]["Button" + x]).indexOf('type') == -1) {
                                var v = [];
                                v.push($scope.all[i].actions[j]["Button" + x].actions[0].ActionID);
                                y["payload"] = v;
                            }
                            $scope.menuObject["buttons"].push(y);

                        }
                    }
                }
            }
        }
        $scope.closeMenuToaster();
        $scope.textToasterId = '';
        $scope.superToasterId = '';
        $scope.menuToasterId = '';
        $scope.scrollableChatItems.push($scope.menuObject);
        $http({
                method: 'POST',
                url: plugApiService.getApi('sendMessageApi') + '/menu',
                data: $scope.menuObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.data.errorMessage) {
                    // $scope.showAlertBar("Error in sending message. Please try again later.", "err");
                }
            });
        $scope.message = '';
    }
};


$scope.returnMessage = function(id) {
    for (var x = 0; x < $scope.all.length; x++) {
        for (var y = 0; y < $scope.all[x].actions.length; y++) {
            if (id == $scope.all[x].actions[y].ActionID) {
                var msg = $scope.all[x].actions[y].Message;
                return msg;
            }
        }
    }
};

$scope.publishMessage = function(id) {
  alertService.addAlert("WOOW","succ");

    if (id) {
        var check = '';
        var msg = $scope.returnMessage(id);
        if ($scope.actionIDS.indexOf(id) < 0) {
            msg = id;
        }
        $scope.closeToaster();
        $scope.textToasterId = '';
        $scope.superToasterId = '';
        $scope.msgObject = {
            "SenderID": $scope.selectedPage.page_id,
            "PageID": $scope.selectedPage.page_id,
            "RecipientID": $scope.activeUserId,
            "Msg": msg,
            "Type": 'text',
            "MessageID": "sef",
            "kind": "outbound",
            "Date": Date.now().toString(),
            'plug_profile_pic': $scope.userData.userDP,
            "plug_user_email": $scope.userData.userEmail,
            "plug_user_name": $scope.userData.userName
        };
        $scope.scrollableChatItems.push($scope.msgObject);
        console.log($scope.msgObject);
        $http({
                method: 'POST',
                url: plugApiService.getApi('sendMessageApi') + '/msg',
                data: $scope.msgObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.data.errorMessage) {
                    // $scope.showAlertBar("Error in sending message. Please try again later.", "err");
                } else {}
            });
        $scope.message = '';
    }
};

$scope.sendDirect = function() {
  if ($scope.activeToaster == 'showTextToaster') {
      $scope.publishMessage($scope.textToasterId);

  }
  if ($scope.activeToaster == 'superPillsToaster') {
      $scope.sendSuperToaster();
  }
  if ($scope.activeToaster == 'imageToaster') {
      $scope.publishImage();
  }
  if ($scope.activeToaster == 'menuToaster') {
      $scope.sendMenuToaster();
  }

  $scope.activeToaster = '';
    var inptVal = $scope.message.toLowerCase();
    if(inptVal.length >0){
      if (inptVal.match("^//")) {

        for (var i = 0; i < $scope.all.length; i++) {
            for (var j = 0; j < $scope.all[i].actions.length; j++) {

                if ($scope.hasShortcut(i, j) == true) {
                    if (inptVal.trim() == $scope.all[i].actions[j].Shortcut.toLowerCase()) {
                        if ($scope.all[i].actions[j].Type == 'text') {

                            if ($scope.textToasterId == $scope.all[i].actions[j].ActionID) {

                                $scope.publishMessage($scope.all[i].actions[j].ActionID);
                                $scope.textToasterId = '';
                            } else {

                                $scope.textToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.activeToaster = 'showTextToaster';

                                $scope.showToaster($scope.all[i].actions[j].ActionID);
                                $scope.activeSrt = inptVal;

                            }
                        }
                        if ($scope.all[i].actions[j].Type == 'image') {

                            if ($scope.imageToasterId == $scope.all[i].actions[j].ActionID) {

                                $scope.publishImage($scope.all[i].actions[j].ActionID);
                                $scope.imageToasterId = '';
                            } else {

                                $scope.imageToasterId = $scope.all[i].actions[j].ActionID;
                                $scope.activeToaster = 'imageToaster';
                                $scope.imageLoaderForToaster = true;
                                $scope.imageToasterTitle = $scope.all[i].actions[j].ActionName;
                                $scope.toasterImageSrc = $scope.all[i].actions[j].plugURL;
                                $scope.activeSrt = inptVal;

                            }
                        }
                        if ($scope.all[i].actions[j].Type == 'superaction') {

                            if ($scope.superToasterId == $scope.all[i].actions[j].ActionID) {
                                $scope.sendSuperToaster();
                                $scope.superToasterId = '';
                            } else {
                                $scope.activeToaster = 'superPillsToaster';
                                $scope.superToasterId = $scope.all[i].actions[j].ActionID;
                                var srt = $scope.all[i].actions[j].Shortcut;
                                var action = {};
                                $scope.toasterSuperPills = [];
                                for (var c = 0; c < 3; c++) {
                                    if ($scope.all[i].actions[j]["Action" + c] == 'null') {} else {
                                        if ($scope.actionIDS.indexOf($scope.all[i].actions[j]["Action" + c].ActionID) > -1) {
                                          action["actionId"] = $scope.all[i].actions[j]["Action" + c].ActionID;
                                          action["actionName"] = actionsAndCategoriesService.getActionNameById($scope.all[i].actions[j]["Action" + c].ActionID);
                                            $scope.toasterSuperPills.push(action);
                                        }
                                    }
                                }
                                $scope.timer = setTimeout(function() {

                                    $scope.closeSuperPillsToaster();
                                }, 25000);
                            }
                        }
                        if ($scope.all[i].actions[j].Type == 'menu') {

                            if ($scope.menuToasterId == $scope.all[i].actions[j].ActionID) {
                                $scope.sendMenuToaster();
                                $scope.menuToasterId = '';
                            } else {

                                $scope.activeToaster = 'menuToaster';
                                $scope.menuToasterId = $scope.all[i].actions[j].ActionID;

                                $scope.menuToasterTitle = $scope.all[i].actions[j].MenuTitle;
                                $scope.menuButtonsNum = Object.keys($scope.all[i].actions[j]).length - 8;

                                $scope.menuToasterBtns = [];

                                for (var f = 0; f < 3; f++) {

                                    if ($scope.all[i].actions[j]["Button" + f] != 'null') {

                                        $scope.menuToasterBtns.push($scope.all[i].actions[j]["Button" + f]);

                                    }
                                }

                                $scope.timer = setTimeout(function() {
                                    $scope.closeMenuToaster();
                                }, 25000);
                            }
                        }



                    }
                }
            }
        }

    } else {

        var multipleMessages = []
        multipleMessages = inptVal.match(/.{1,320}/g);
        for (var b = 0; b < multipleMessages.length; b++) {
            $scope.publishMessage(multipleMessages[b]);
            setTimeout(function() {
                $scope.closeSuperPillsToaster();
            }, 500);
        }
    }
  }
};

$scope.sendTextToaster = function() {
    $scope.publishMessage($scope.textToasterId);
};

$scope.editTextToaster = function() {
    $scope.message = $scope.textToasterMessage;
    setTimeout(function() {
        $scope.activeToaster = '';
        $scope.activeSrt = '';
        $scope.textToasterId = '';
        clearTimeout($scope.timer);
        $scope.activeToaster = '';
    }, 800);
    $scope.activeToaster = '';

};

$scope.sendImageToaster = function() {
    $scope.publishImage($scope.imageToasterId);
    $scope.activeToaster = '';
};

$scope.showToasterMessage = function(actId, srt) {
    $('#toasterimage').attr('src', '');
    $scope.message = srt;
    for (var i = 0; i < $scope.all.length; i++) {
        for (var j = 0; j < $scope.all[i].actions.length; j++) {

            if ($scope.all[i].actions[j].ActionID == actId)

            {
                if ($scope.all[i].actions[j].Type == 'text') {

                    $scope.showToaster($scope.all[i].actions[j].ActionID);
                    $scope.textToasterId = actId;

                }

                if ($scope.all[i].actions[j].Type == 'superaction') {
                    $scope.activeToaster = 'superPillsToaster';
                    var action = {};
                    $scope.superToasterId = actId;
                    $scope.super_message = '';
                    var srt = $scope.all[i].actions[j].Shortcut;
                    $scope.toasterSuperPills = [];
                    for (var c = 0; c < 3; c++) {
                        if ($scope.all[i].actions[j]["Actiond" + c] == 'null') {} else {
                            if ($scope.actionIDS.indexOf($scope.all[i].actions[j]["Action" + c].ActionID) > -1) {

                              action["actionId"] = $scope.all[i].actions[j]["Action" + c].ActionID;
                              action["actionName"] = actionsAndCategoriesService.getActionNameById($scope.all[i].actions[j]["Action" + c].ActionID);
                                $scope.toasterSuperPills.push(action);
                            }

                        }
                    }
                    $scope.timer = setTimeout(function() {
                        $scope.closeSuperPillsToaster();
                    }, 25000);

                }

                if ($scope.all[i].actions[j].Type == 'image') {
                    $scope.imageToasterTitle = $scope.all[i].actions[j].ActionName;
                    $scope.activeToaster = 'imageToaster';
                    $scope.imageLoaderForToaster = true;
                    $scope.imageToasterId = $scope.all[i].actions[j].ActionID;
                    $scope.toasterImageSrc = $scope.all[i].actions[j].plugURL;

                }

                if ($scope.all[i].actions[j].Type == 'menu') {

                    $scope.activeToaster = 'menuToaster';
                    $scope.menuToasterId = $scope.all[i].actions[j].ActionID;
                    $scope.menuToasterTitle = $scope.all[i].actions[j].MenuTitle;
                    $scope.menuButtonsNum = Object.keys($scope.all[i].actions[j]).length - 8;
                    $scope.menuToasterBtns = [];
                    for (var f = 0; f < $scope.menuButtonsNum; f++) {
                        if ($scope.all[i].actions[j]["Button" + f] != 'null') {

                            $scope.menuToasterBtns.push($scope.all[i].actions[j]["Button" + f]);

                        }
                    }
                    $scope.timer = setTimeout(function() {
                        $scope.closeMenuToaster();
                    }, 25000);
                }

            }
        }
    }

};

$scope.publishImage = function(id) {
    if (id) {
        var check = '';
        for (var i = 0; i < $scope.all.length; i++) {

            for (var j = 0; j < $scope.all[i].actions.length; j++) {
                if (id == $scope.all[i].actions[j].ActionID) {
                    var img = $scope.all[i].actions[j].plugURL;
                }
            }
        }
        $scope.closeToaster();
        $scope.textToasterId = '';
        $scope.superToasterId = '';
        $scope.imageObject = {
            "SenderID": $scope.selectedPage.page_id,
            "PageID": $scope.selectedPage.page_id,
            "RecipientID": $scope.activeUserId,
            "plugURL": img,
            "kind": "outbound",
            'Type': 'image',
            "Date": Date.now().toString(),
            "plug_profile_pic": $scope.userData.userDP,
            "plug_user_email": $scope.userData.userEmail,
            "plug_user_name": $scope.userData.userName
        };
        $scope.scrollableChatItems.push($scope.imageObject);
        $http({
                method: 'POST',
                url: plugApiService.getApi('sendMessageApi') + '/image',
                data: $scope.imageObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.data.errorMessage) {
                    // $scope.showAlertBar("Error in sending message. Please try again later.", "err");
                    // $scope.netError = true;
                } else {}
            });
        $scope.message = '';
    }
};

$scope.returnMessageType = function(id) {
    for (var i = 0; i < $scope.all.length; i++) {
        for (var j = 0; j < $scope.all[i].actions.length; j++) {
            if ($scope.all[i].actions[j].ActionID == id) {
                var type = $scope.all[i].actions[j].Type;
            }
        }
    }
    return type;
};

$scope.sendSuperToaster = function() {
  $scope.message = '';
    $scope.superObject = {
        "SenderID": $scope.selectedPage.page_id,
        "PageID": $scope.selectedPage.page_id,
        "RecipientID": $scope.activeUserId,
        "ActionID": $scope.superToasterId,
        "Type": 'text',
        "kind": "outbound",
        "Date": Date.now().toString(),
        'plug_profile_pic': $scope.userData.userDP,
        "plug_user_email": $scope.userData.userEmail,
        "plug_user_name": $scope.userData.userName
    };
    for (var i = 0; i < $scope.all.length; i++) {
        for (var j = 0; j < $scope.all[i].actions.length; j++) {
            if ($scope.superToasterId == $scope.all[i].actions[j].ActionID) {
                for (var c = 0; c < 3; c++) {
                    if ($scope.all[i].actions[j]["Action" + c] != 'null') {

                        var messageType = $scope.returnMessageType($scope.all[i].actions[j]["Action" + c].ActionID);

                        if (messageType == 'text') {
                            var message = $scope.returnMessage($scope.all[i].actions[j]["Action" + c].ActionID);
                            var msgObject = {
                                "SenderID": $scope.selectedPage.page_id,
                                "PageID": $scope.selectedPage.page_id,
                                "RecipientID": $scope.activeUserId,
                                "Msg": message,
                                "Type": 'text',
                                "MessageID": "sef",
                                "kind": "outbound",
                                "Date": Date.now().toString(),
                                'plug_profile_pic': $scope.userData.userDP,
                                "plug_user_email": $scope.userData.userEmail,
                                "plug_user_name": $scope.userData.userName
                            };
                            $scope.scrollableChatItems.push(msgObject);

                        }
                        if (messageType == 'image') {
                            var img = $scope.returnUrl($scope.all[i].actions[j]["Action" + c].ActionID);
                            var msgObject = {
                                "SenderID": $scope.selectedPage.page_id,
                                "PageID": $scope.selectedPage.page_id,
                                "RecipientID": $scope.activeUserId,
                                "plugURL": img,
                                "kind": "outbound",
                                'Type': 'image',
                                "Date": Date.now().toString(),
                                "plug_profile_pic": $scope.userData.userDP,
                                "plug_user_email": $scope.userData.userEmail,
                                "plug_user_name": $scope.userData.userName
                            };

                            $scope.scrollableChatItems.push(msgObject);
                        }

                    }
                }
            }
        }
    }
    $scope.closeSuperPillsToaster();
    $http({
            method: 'POST',
            url: plugApiService.getApi('sendMessageApi') + '/super',
            data: $scope.superObject,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (response.data.errorMessage) {
                // ERROR in posting
                // $scope.showAlertBar("Error in sending message.", "err");
            } else {}
        });
};


$scope.closeImageToaster = function() {
    $scope.activeToaster = '';
    $scope.message = '';
    $scope.imageToasterId = '';
};

$scope.closeSuperPillsToaster = function() {
        $scope.message = '';
        $scope.activeToaster = '';
        $scope.superToasterId = '';
        $scope.activeSrt = '';
};

$scope.closeMenuToaster = function() {
        $scope.message = '';
        $scope.activeToaster = '';
        $scope.superToasterId = '';
        $scope.activeSrt = '';
        $scope.menuToasterId = '';
};

$scope.closeToaster = function() {
        $scope.activeToaster = '';
        $scope.activeSrt = '';
        $scope.textToasterId = '';
        $scope.message = '';
        $scope.activeToaster = '';
};


}]);

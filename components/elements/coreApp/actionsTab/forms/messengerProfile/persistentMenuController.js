var app = angular.module('plugApp');

app.controller('persistentMenuController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','menuService','messengerProfileService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,menuService,
  messengerProfileService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';
  $scope.all=[];

  /* Menu Object */
    $scope.resetPageData = function(){
      $scope.menu;

      /* Actions Object */
      $scope.actions;

      /* Selected DropDown Action */
      $scope.selectedAction;

      /* Form visibility Buttons */
      $scope.menuFormVisibility = false;
      $scope.form2Visibility = false;
      $scope.form3Visibility = false;
      $scope.disableSavingOption = false;
      $scope.showEditDenyMessage = false;
      $scope.denyEditSaveMessageForName = false;
      $scope.denyEditSaveMessageForNameUrl = false;
      $scope.denyEditSaveMessageForNameSubmenu = false;
      $scope.showDenyMessage = false;
      $scope.denySaveMessageForName = false;
      $scope.denySaveMessageForNameSubmenu = false;
      $scope.denySaveMessageForNameUrl = false;

      $scope.sEditSubmenuName = false;
      $scope.fEditSubmenuName = false;
      $scope.subMenuLevel = 0;
      $scope.preservedState = false;
      $scope.depthForSubEdit = 0;
      $scope.depthForSub = 0;
      $scope.switchState = false;
      $scope.st = false;
      $scope.label = '';
      $scope.publishLoader = false;

    };

  $scope.resetPageData();

  $rootScope.$on("updatePageContent", function(){
    $scope.resetPageData();
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $('#editPersistentActions').trigger('chosen:updated');
    $('#perstMenuActions').trigger('chosen:updated');
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("updateMessengerProfile", function(){
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("openMessengerProfile", function(event,data){
    if(data.profile_type == 'persistentMenu'){
      $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
      $scope.all = actionsAndCategoriesService.getActionsAndCategries();
      $scope.openPersistentMenuForm();
    }
  });

  $scope.openPersistentMenuForm = function(){
    var flag = false;
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
    if ($scope.messengerProfiles.length == 0) {
          $scope.nestButton = false;

          $scope.actionButton = false;

          $scope.actionDropDown = false;

          $scope.menu = {
              "call_to_actions": [

              ]
          };
          $scope.form2Visibility = false;
          $scope.form3Visibility = false;
      }

      for (var i = 0; i < $scope.messengerProfiles.length; i++) {
          if (Object.keys($scope.messengerProfiles[i]).indexOf('callToActions') >= 0) {
              flag = true;
              $scope.menu = {};
              $scope.menu["call_to_actions"] = $scope.messengerProfiles[i].callToActions;
              $scope.menu["ProfileID"] = $scope.messengerProfiles[i].ProfileID;
              $scope.menu["Status"] = $scope.messengerProfiles[i].Status;
              $scope.st = $scope.menu["Status"];
              $scope.setToggleState($scope.menu["Status"]);
          }
          if (i == $scope.messengerProfiles.length - 1 && flag == false) {
              $scope.nestButton = false;

              $scope.actionButton = false;

              $scope.actionDropDown = false;

              $scope.menu = {
                  "call_to_actions": [

                  ]
              };
          }
      }
  };

  $scope.setToggleState = function(status) {
      if (status == 'true') {
        $scope.st = true;
          $('#togSwitch').prop('checked', true);
          $scope.switchState = true;
      } else {
          $('#togSwitch').prop('checked', false);
          $scope.switchState = false;
          $scope.st = false;
      }
  };

  $scope.setActiveLabel = function(buttonNumber, button, depth) {
      angular.element(jQuery('#editPrstMenuBtnName')).triggerHandler('input');
      angular.element(jQuery('#editPerMenuUrl')).triggerHandler('input');
      if (depth == 1) {
          for (var i = 0; i < $scope.menu.call_to_actions.length; i++) {
              if ($scope.menu.call_to_actions[i] == button) {

                  $scope.firstActiveAction = i;
                  $scope.fLevelBut = i;
                  if (i == 0) {
                      $('#persistantMenuEditArrow').css('top', "15px");
                      $('#editPopupWindow').css('margin-top', "30px");
                  }
                  if (i == 1) {
                      $('#persistantMenuEditArrow').css('top', "48px");
                      $('#editPopupWindow').css('margin-top', "50px");
                  }
                  if (i == 2) {
                      $('#persistantMenuEditArrow').css('top', "45px");
                      $('#editPopupWindow').css('margin-top', "120px");
                  }
                  break;
              }
          }
          $scope.nestButton = true;
          $scope.actionButton = true;
          $scope.currentDepth = depth;
          if (button.type == 'nested') {
              $scope.activePopup = '';
              $("#submenuNameTwo").val(button.title);
              if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions) {

                  $scope.form2Visibility = true;
              }
              if (Object.keys($scope.menu.call_to_actions[$scope.firstActiveAction]).indexOf("call_to_actions") >= 0) {
                  if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions.length > 0) {
                      for (var h = 0; h < $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions.length; h++) {
                          if (Object.keys($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[h]).indexOf("call_to_actions") >= 0) {
                              $scope.form3Visibility = true;

                          }

                      }
                  }
              } else {
                  $scope.form3Visibility = false;
              }
          }
          if (button.type == 'postback') {
              $scope.openEditButtonForm(button, depth);
              $scope.form2Visibility = false;
              $scope.form3Visibility = false;
          }
          if (button.type == 'web_url') {
              $scope.openEditButtonForm(button, depth);
              $('#editTabs a[data-target="#etab2"]').tab('show');
              //$('#editPerMenuUrl').val(button.url);
          }



      } else if (depth == 2) {
          var menuArray = $scope.menu.call_to_actions[$scope.firstActiveAction];
          for (var i = 0; i < menuArray.call_to_actions.length; i++) {
              if (menuArray.call_to_actions[i] == button) {
                  $scope.secondActiveAction = i;
                  $scope.sLevelBut = i;
                  if (i == 0) {
                      $('#persistantMenuEditArrow').css('top', "25px");
                      $('#editPopupWindow').css('margin-top', "20px");
                  }
                  if (i == 1) {
                      $('#persistantMenuEditArrow').css('top', "65px");
                      $('#editPopupWindow').css('margin-top', "50px");
                  }
                  if (i == 2) {
                      $('#persistantMenuEditArrow').css('top', "65px");
                      $('#editPopupWindow').css('margin-top', "120px");
                  }
                  if (i == 3) {
                      $('#persistantMenuEditArrow').css('top', "115px");
                      $('#editPopupWindow').css('margin-top', "140px");
                  }
                  if (i == 4) {
                      $('#persistantMenuEditArrow').css('top', "165px");
                      $('#editPopupWindow').css('margin-top', "160px");
                  }
                  break;
              }
          }
          $scope.nestButton = true;
          $scope.actionButton = true;
          $scope.currentDepth = depth;
          if (button.type == 'nested') {
              $("#subMenuNameThree").val(button.title);
              $scope.activePopup = '';
              console.log("hello");
              if (menuArray.call_to_actions[$scope.secondActiveAction].call_to_actions) {
                  $scope.form3Visibility = true;
              }
          }
          if (button.type == 'postback') {
              $scope.openEditButtonForm(button, depth);
              $scope.form3Visibility = false;
          }
          if (button.type == 'web_url') {
              $scope.openEditButtonForm(button, depth);
              $('#editTabs a[data-target="#etab2"]').tab('show');
          }
      } else if (depth == 3) {
          var menuArray = $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction];
          for (var i = 0; i < menuArray.call_to_actions.length; i++) {
              if (menuArray.call_to_actions[i] == button) {
                  $scope.thirdActiveAction = i;
                  if (i == 0) {
                      $('#persistantMenuEditArrow').css('top', "25px");
                      $('#editPopupWindow').css('margin-top', "20px");
                  }
                  if (i == 1) {
                      $('#persistantMenuEditArrow').css('top', "65px");
                      $('#editPopupWindow').css('margin-top', "50px");
                  }
                  if (i == 2) {
                      $('#persistantMenuEditArrow').css('top', "65px");
                      $('#editPopupWindow').css('margin-top', "120px");
                  }
                  if (i == 3) {
                      $('#persistantMenuEditArrow').css('top', "115px");
                      $('#editPopupWindow').css('margin-top', "140px");
                  }
                  if (i == 4) {
                      $('#persistantMenuEditArrow').css('top', "165px");
                      $('#editPopupWindow').css('margin-top', "160px");
                  }
                  break;
              }
          }
          $scope.nestButton = false;
          $scope.actionButton = true;
          $scope.currentDepth = depth;
      }
      if (button.type == "postback") {
          $scope.openEditButtonForm(button, depth);
          $scope.actionButton = false;
      }
      if (button.type == "web_url") {
          $scope.openEditButtonForm(button, depth);
          $('#editTabs a[data-target="#etab2"]').tab('show');
      } else {
          $scope.actionDropDown = false;
          $scope.selectedAction = "";
      }
      if (button.type == "nested") {
          $scope.nestButton = false;
      }
  };

  $scope.isValidSubmenu = function(obj) {
      if (obj.call_to_actions.length > 0) {
          return true;
      } else {
          return false;
      }

  };

  $scope.checkForm2Visibility = function() {
      if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions) {
          $scope.form2Visibility = true;
      }

      if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions) {
          $scope.form3Visibility = true;
      }
  };

  $scope.getParsedName = function(x) {
      var id = '';
      try {
          id = JSON.parse(x)["actions"][0];
      } catch (e) {
          id = x["actions"][0];
      }
      return actionsAndCategoriesService.getActionNameById(id);
  };

  $scope.openEditButtonForm = function(button, depth) {
      $("#editActionPresenceOne").val('');
      $("#editLabelPresenceOne").val('');
      $("#editLabelPresenceTwo").val('');
      $("#editLabelPresenceThree").val('');
      $scope.activePopup = 'editPopup';
      $scope.depthForSubEdit = depth;
      if (Object.keys(button).indexOf("payload") >= 0) {
          if (typeof button.payload !== 'object') {

              button.payload = JSON.parse(button.payload);
          }

      }
      $("#editPrstMenuBtnName").val(button.title);
      angular.element(jQuery('#editPrstMenuBtnName')).triggerHandler('input');
      if (button.type == 'postback') {
          $("#editPersistentActions").chosen().val(button.payload["actions"][0]);
          $('#editMenuTabs a[data-target="#editTab1"]').tab('show');
          $('#editPersistentActions').trigger('chosen:updated');
      }
      if (button.type == 'web_url') {
          $("#editPerMenuUrl").val(button.url);
          $('#editMenuTabs a[data-target="#editTab2"]').tab('show');
      }
  };

  $scope.hoverButtonsVisibility = 0;
  $scope.currentMenuDepth = 1;

  $scope.setHoverAction = function(label_index) {
      if ($scope.currentMenuDepth == 2)
          if ($scope.hoverButtonsVisibility <= 2)
              return;
          else if ($scope.currentMenuDepth == 3)
          if ($scope.hoverButtonsVisibility <= 7)
              return;
      $scope.hoverButtonsVisibility = label_index;
  };

  $scope.checkHoveredLabel = function(label_index) {
      if (label_index == $scope.hoverButtonsVisibility) {
          return true;
      } else {
          return false;
      }
  };

  $scope.publishMenu = function() {
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["callToActions"] = $scope.menu["call_to_actions"];
      obj["Type"] = "menu";
      if (messengerProfileService.checkPerMenExists()) {
          obj["ProfileID"] = $scope.menu["ProfileID"];
      }
      if ($scope.st == true) {
          obj["Status"] = "true"
          $scope.publishPersistantMenu(obj);
      } else {
          $scope.showDisableModal();
      }

  };

  $scope.publishPersistantMenu = function(obj) {
      var ob = obj;
      $scope.publishLoader = true;
      var url = plugApiService.getApi('setAndSavePersistentMenuApi');
      $http({
              method: 'POST',
              url: url,
              data: ob,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.publishLoader = false;
              if (response.errorMessage) {
                  alertService.addAlert("Something went wrong. Please try again later", "err");
              } else {
                  alertService.addAlert("Persistent Menu saved.", "succ");
              }
          });
  };

  // $scope.deletePersistentMenu = function(url) {
  //     if (Object.keys($scope.menu).indexOf("ProfileID") >= 0) {
  //         obj = {};
  //         obj["ProfileID"] = $scope.menu["ProfileID"];
  //         obj["PageID"] = $scope.selectedPage.page_id
  //         obj["plug_user_name"] = $scope.userData.userName;
  //         obj["plug_user_email"] = $scope.userData.userEmail;
  //
  //         $http({
  //                 method: 'POST',
  //                 url: url,
  //                 data: obj,
  //                 headers: {
  //                     'Content-Type': 'application/json'
  //                 }
  //             })
  //             .success(function(response) {
  //                 console.log(response);
  //                 if (response.errorMessage) {
  //                     $scope.secondDeletion(obj, url);
  //                     alertService.addAlert("Something went wrong.Please try again later", "err");
  //
  //                 } else {
  //                     for (var i = 0; i < $scope.messengerProfiles.length; i++) {
  //
  //                         if ($scope.messengerProfiles[i].ProfileID == $scope.menu["ProfileID"]) {
  //                             $scope.messengerProfiles.splice(i, 1);
  //                             if (obj.Type = "greeting") {
  //                                 $scope.sgt = false;
  //                                 $scope.gtswitchState = false;
  //                             }
  //                             if (obj.Type == "getstarted") {
  //                                 $scope.sst = false;
  //                                 $scope.gsswitchState = false;
  //                             }
  //                             if (obj.Type == "persistantMenu") {
  //                                 $scope.st = false;
  //                                 $scope.switchState = false;
  //                             }
  //
  //                             $rootScope.$emit("closeActiveForm", {});
  //                         }
  //                     }
  //                     alertService.addAlert("Persistent Menu Deleted.", "succ");
  //
  //                 }
  //             });
  //     }
  //
  // };

  $scope.deleteMenuFromFb = function(url, type) {
      if (Object.keys($scope.menu).indexOf("ProfileID") >= 0) {
          obj = {};
          obj["PageID"] = $scope.selectedPage.page_id;
          obj["plug_user_name"] = $scope.userData.userName;
          obj["plug_user_email"] = $scope.userData.userEmail;

          $http({
                  method: 'POST',
                  url: url,
                  data: obj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  console.log("RESPONSE FOR deletion");
                  console.log(response);

                  if (response.result == 'success') {
                      alertService.addAlert("Deleted " + type + " from facebook.", "succ");
                  } else {
                      $scope.secondDeletionFromFB(obj, url, type);
                  }
              });
      }
  };

  $scope.secondDeletionFromFB = function(obj, url, type) {
      console.log($scope.menu);
      if (Object.keys($scope.menu).indexOf("ProfileID") >= 0) {
          console.log("ojjj");
          $http({
                  method: 'POST',
                  url: url,
                  data: obj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  console.log(response);
                  if (response.result == 'success') {
                      alertService.addAlert("Deleted " + type + " from facebook.", "succ");
                  } else {
                      alertService.addAlert("Something went wrong. Please try again later.", "err");
                  }
              });
      }
  };

  $scope.setPersistantMenu = function() {
      var flag = messengerProfileService.checkPerMenExists();
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["callToActions"] = $scope.menu["call_to_actions"];
      obj["Type"] = "menu";
      if (flag == true) {
          console.log("Sending profile Id");
          obj["ProfileID"] = $scope.menu["ProfileID"];
      }
      if ($scope.st == true) {
          obj["Status"] = "true";
      } else {
          obj["Status"] = "false";
      }
      $scope.setPersistentMenu(obj);
  };

  $scope.secondDeletion = function(obj, url) {
      console.log($scope.menu);
      if (Object.keys(obj).indexOf("ProfileID") >= 0) {
          console.log("ojjj");
          $http({
                  method: 'POST',
                  url: url,
                  data: obj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  console.log(response);
                  if (response.errorMessage) {
                      alertService.addAlert("Something went wrong. Please try again later.", "err");

                  } else {
                      for (var i = 0; i < $scope.messengerProfiles.length; i++) {
                          // console.log("----");
                          console.log($scope.messengerProfiles);
                          if ($scope.messengerProfiles[i].ProfileID == $scope.menu["ProfileID"]) {
                              $scope.messengerProfiles.splice(i, 1);
                              console.log("----");
                              console.log($scope.messengerProfiles);
                              if (obj.Type = "greeting") {
                                  $scope.sgt = false;
                                  $scope.gtswitchState = false;

                              }
                              if (obj.Type == "getstarted") {
                                  $scope.sst = false;
                                  $scope.gsswitchState = false;

                              }
                              if (obj.Type == "persistantMenu") {
                                  $scope.st = false;
                                  $scope.switchState = false;

                              }
                              console.log("&&&");
                              $rootScope.$emit("closeActiveForm", {});
                          }
                      }
                      alertService.addAlert("Persistent Menu Deleted.", "succ");

                  }
              });
      }
  };

  $scope.firstActiveAction;
  $scope.secondActiveAction;
  $scope.thirdActiveAction;
  $scope.currentDepth;
  $scope.nestButton = false;
  $scope.actionButton = false;
  $scope.levelNumber;
  $scope.actionDropDown = false;

  $scope.setPersistentMenu = function(obj) {
      $scope.persistantMenuLoader = true;
      var url = plugApiService.getApi('setPersistentMenuApi');
      $http({
              method: 'POST',
              url: url,
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.persistantMenuLoader = false;
              if (response.errorMessage) {

                  alertService.addAlert("Something went wrong. Please try again later.", "err");

              } else {
                  if (Object.keys(obj).indexOf("ProfileID") < 0) {
                      obj["ProfileID"] = response.ProfileID;
                      $scope.menu["ProfileID"] = response.ProfileID;
                      $scope.isPublishableBtn = true;
                      $scope.messengerProfiles.push(obj);
                  } else {
                      $scope.isPublishableBtn = true;
                      $scope.updatePersistentMenu(obj);
                  }
                  alertService.addAlert("Persistent Menu saved.", "succ");
              }
          });
  };

  $scope.updatePersistentMenu = function(obj) {
      for (var i = 0; i < $scope.messengerProfiles.length; i++) {
          if ($scope.messengerProfiles[i].ProfileID == $scope.activePersistentMenu) {
              $scope.messengerProfiles[i] = obj;
          }
      }
  };

  $scope.openAddButtonForm = function(crntArray, depth) {
      $("#perMenuUrl").val('');
      $("#actionPresenceOne").val('');
      $("#labelPresenceOne").val('');
      $("#labelPresenceTwo").val('');
      $("#labelPresenceThree").val('');
      $("#perstMenuActions").chosen().val('');
      $('#addMenuTabs a[data-target="#addTab1"]').tab('show');
      angular.element(jQuery('#prstMenuBtnCountBadge')).triggerHandler('input');
      angular.element(jQuery('#prstMenuBtnName')).triggerHandler('input');
      angular.element(jQuery('#perMenuUrl')).triggerHandler('input');
      $scope.depthForSub = depth;
      if (depth == 1) {
          $scope.firstActiveAction = 4;
          $scope.form2Visibility = false;
          $scope.form3Visibility = false;

          if (crntArray.length == 0) {
              $('#persistantMenuArrow').css('top', "16px");
              $('#addPopupWindow').css('margin-top', "-10px");
          }
          if (crntArray.length == 1) {
              $('#persistantMenuArrow').css('top', "15px");
              $('#addPopupWindow').css('margin-top', "60px");
          }
          if (crntArray.length == 2) {
              $('#persistantMenuArrow').css('top', "10px");
              $('#addPopupWindow').css('margin-top', "135px");
          }
      }
      if (depth == 2) {
          $scope.secondActiveAction = 6;
          $scope.form3Visibility = false

          if (crntArray.length == 0) {
              $('#persistantMenuArrow').css('top', "50px");
              $('#addPopupWindow').css('margin-top', "-10px");
          }
          if (crntArray.length == 1) {
              $('#persistantMenuArrow').css('top', "50px");
              $('#addPopupWindow').css('margin-top', "60px");
          }
          if (crntArray.length == 2) {
              $('#persistantMenuArrow').css('top', "44px");
              $('#addPopupWindow').css('margin-top', "135px");
          }
          if (crntArray.length == 3) {
              $('#persistantMenuArrow').css('top', "103px");
              $('#addPopupWindow').css('margin-top', "145px");
          }
          if (crntArray.length == 4) {
              $('#persistantMenuArrow').css('top', "163px");
              $('#addPopupWindow').css('margin-top', "155px");
          }
      }
      if (depth == 3) {
          $scope.thirdActiveAction = 6;

          if (crntArray.length == 0) {
              $('#persistantMenuArrow').css('top', "50px");
              $('#addPopupWindow').css('margin-top', "-10px");
          }
          if (crntArray.length == 1) {
              $('#persistantMenuArrow').css('top', "50px");
              $('#addPopupWindow').css('margin-top', "60px");
          }
          if (crntArray.length == 2) {
              $('#persistantMenuArrow').css('top', "44px");
              $('#addPopupWindow').css('margin-top', "135px");
          }
          if (crntArray.length == 3) {
              $('#persistantMenuArrow').css('top', "103px");
              $('#addPopupWindow').css('margin-top', "145px");
          }
          if (crntArray.length == 4) {
              $('#persistantMenuArrow').css('top', "163px");
              $('#addPopupWindow').css('margin-top', "155px");
          }
      }
      $("#prstMenuBtnName").val('');
      $("#perstMenuActions").chosen().val('');
      $scope.currentButtonsArray = crntArray;
      $scope.activePopup = 'addPopup';
  };

  $scope.addButton = function() {
      var persistentActionlen = $("select[id='perstMenuActions'] option:selected").length;
      var optionName = $("#prstMenuBtnName").val();
      console.log(optionName);
      console.log(persistentActionlen);
      if (persistentActionlen == 0 || optionName == 0) {
          if (persistentActionlen == 0) {
              $scope.showDenyMessage = true;
          }
          if (optionName == 0) {
              $scope.denySaveMessageForName = true;
          }

      } else {
          $scope.showDenyMessage = false;
          $scope.denySaveMessageForName = false;
          var buttonsArray = $scope.currentButtonsArray;
          var obj = {};
          var p = {};
          p["name"] = $("#prstMenuBtnName").val();
          p["actions"] = [];
          p["actions"].push($("#perstMenuActions").chosen().val());

          obj["payload"] = JSON.stringify(p);
          obj["title"] = $("#prstMenuBtnName").val();
          obj["type"] = "postback";
          buttonsArray.push(obj);
          $scope.activePopup = '';
      }
  };

  $scope.editOptionButton = function() {
      var editOptionName = $("#editPrstMenuBtnName").val().length;
      if (editOptionName == 0) {
          $scope.denyEditSaveMessageForName = true;
      } else {
          var obj = {};
          var p = {};

          p["name"] = $("#editPrstMenuBtnName").val();
          p["actions"] = [];
          p["actions"].push($("#editPersistentActions").chosen().val());
          obj["payload"] = JSON.stringify(p);
          obj["title"] = $("#editPrstMenuBtnName").val();
          obj["type"] = "postback";
          if ($scope.currentDepth == 1) {
              $scope.menu.call_to_actions[$scope.firstActiveAction] = obj;
          }
          if ($scope.currentDepth == 2) {
              $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction] = obj;
          }
          if ($scope.currentDepth == 3) {
              $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions[$scope.thirdActiveAction] = obj;
          }

          $scope.activePopup = '';
      }

  };

  $scope.whitelistPerUrl = function(url) {
      var obj = {};
      var whiteListArray = [];
      var flag = true;
      var domain = url.split("/");
      whiteListArray[0] = domain[0] + "//" + domain[2];
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["whitelist"] = whiteListArray;
      $http({
              method: 'POST',
              url: plugApiService.getApi('whitelistApi'),
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              console.log(response);
              if (response.error) {
                  var flag = false;
                  alertService.addAlert(response.error.message, "err");
              } else {
                  var flag = true;
              }
          });
      return flag;

  };

  $scope.addUrlButton = function() {
      var optionName = $("#prstMenuBtnName").val();
      if (optionName == 0) {
          $scope.denySaveMessageForNameUrl = true;
      } else {
          $scope.showDenyMessageForNameUrl = false;
          var string = $("#perMenuUrl").val();
          var substr = "https://";
          if (string.includes(substr)) {
              var url = $("#perMenuUrl").val();
          } else {
              var url = "https://" + $("#perMenuUrl").val();
          }
          var flag = $scope.whitelistPerUrl(url);
          if (flag) {
              var buttonsArray = $scope.currentButtonsArray;
              var obj = {};
              obj["title"] = $("#prstMenuBtnName").val();
              obj["type"] = "web_url";
              obj["webview_height_ratio"] = "full";
              obj["messenger_extensions"] = "true";
              obj["url"] = url;
              console.log("URL WALA OBJECT");
              console.log(obj);
              buttonsArray.push(obj);
              console.log("BUTTONSARRAY");
              console.log(buttonsArray);
              $scope.activePopup = '';
          } else {
              console.log("ERROR WHITELISTINg");
          }
      }

  };

  $scope.editUrlButton = function() {
      var editOptionName = $("#editPrstMenuBtnName").val().length;
      if (editOptionName == 0) {
          $scope.denyEditSaveMessageForNameUrl = true;
      } else {
          $scope.denyEditSaveMessageForNameUrl = false;
          var obj = {};

          var string = $("#editPerMenuUrl").val();
          var substr = "https://";
          console.log("EDIT WALA URL");
          console.log(string.includes(substr));

          if (string.includes(substr)) {
              console.log("https presnt");
              var url = $("#editPerMenuUrl").val();
          } else {
              console.log("https not present");
              var url = "https://" + $("#editPerMenuUrl").val();
          }

          obj["webview_height_ratio"] = "full";
          obj["messenger_extensions"] = "true";
          obj["title"] = $("#editPrstMenuBtnName").val();
          obj["type"] = "web_url";
          obj["url"] = url;
          console.log(obj["url"]);
          var flag = $scope.whitelistPerUrl(url);
          console.log("flaggg" + flag);
          if (flag) {
              if ($scope.currentDepth == 1) {
                  $scope.menu.call_to_actions[$scope.firstActiveAction] = obj;
              }
              if ($scope.currentDepth == 2) {
                  $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction] = obj;
              }
              if ($scope.currentDepth == 3) {
                  $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions[$scope.thirdActiveAction] = obj;
              }

          } else {
              alertService.addAlert("Please enter a valid URL", "err");
          }
          $scope.activePopup = '';
      }
  };

  $scope.editNestedOptionButton = function() {
      var editOptionName = $("#editPrstMenuBtnName").val().length;
      if (editOptionName == 0) {
          $scope.denyEditSaveMessageForNameSubmenu = true;
      } else {
          $scope.denyEditSaveMessageForNameUrl = false;
          var obj = {};

          obj["title"] = $("#editPrstMenuBtnName").val();
          obj["type"] = "nested";
          obj["call_to_actions"] = [];

          if ($scope.currentDepth == 1) {
              $scope.menu.call_to_actions[$scope.firstActiveAction] = obj;
          }
          if ($scope.currentDepth == 2) {
              $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction] = obj;
          }
          if ($scope.currentDepth == 3) {
              $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions[$scope.thirdActiveAction] = obj;
          }

          $scope.activePopup = '';
      }
  };

  $scope.editNestedOptionButtonName = function(depth) {
      if (depth == 1) {

          $scope.menu.call_to_actions[$scope.firstActiveAction].title = $("#submenuNameTwo").val();
          console.log($scope.menu.call_to_actions[$scope.firstActiveAction].title);
      }
      if (depth == 2) {
          $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].title = $("#subMenuNameThree").val();
      }

  };

  $scope.addNestedButton = function() {
      var optionName = $("#prstMenuBtnName").val().length;
      if (optionName == 0) {
          $scope.denySaveMessageForNameSubmenu = true;
      } else {
          $scope.denySaveMessageForNameSubmenu = false;

          var buttonsArray = $scope.currentButtonsArray;
          var obj = {};
          obj["title"] = $("#prstMenuBtnName").val();
          obj["type"] = "nested";

          buttonsArray.push(obj);
          console.log(buttonsArray);
          var buttonTitle = $("#nestedButtonName").val();
          buttonsArray[buttonsArray.length - 1].call_to_actions = [];
          $scope.activePopup = '';

      }
  };

  $scope.addActionToButton = function() {

      if ($scope.currentDepth == 1) {
          $scope.actionDropDown = true;
          $scope.menu.call_to_actions[$scope.firstActiveAction].type = "postback";

          if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions) {
              delete $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions;
          }
      }
      if ($scope.currentDepth == 2) {
          $scope.actionDropDown = true;
          $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].type = "postback";

          if ($scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions) {
              delete $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions;
          }
      }
      if ($scope.currentDepth == 3) {
          $scope.actionDropDown = true;
          $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions[$scope.thirdActiveAction].type = "postback";
      }
  };

  $scope.addPayloadToButton = function() {
      $scope.selectedAction = $('#persistantMenuActions').chosen().val();

      if ($scope.currentDepth == 1) {
          $scope.menu.call_to_actions[$scope.firstActiveAction].payload = $scope.selectedAction;
      }
      if ($scope.currentDepth == 2) {
          $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].payload = $scope.selectedAction;
      }
      if ($scope.currentDepth == 3) {
          $scope.menu.call_to_actions[$scope.firstActiveAction].call_to_actions[$scope.secondActiveAction].call_to_actions[$scope.thirdActiveAction].payload = $scope.selectedAction;
      }
      console.log($scope.menu);

  };

  $scope.isActiveClass = function(button, depth) {
      if (depth == 1) {
          if (button == $scope.menu.call_to_actions[$scope.firstActiveAction]) {
              return "activeLabel";
          }
      }
      return;
  };
// -----------------------------------------------------------------------------------------------
  $scope.checkGreetingTextExists = function(){
    return messengerProfileService.checkGreetingTextExists();
  };

  $scope.disablePmPblsBtn = function() {

      return messengerProfileService.checkPerMenExists();
  };

  $scope.greetingToggleButton = function(x) {
      $scope.gtswitchState = x.sgt;
      $scope.gtpreservedState = x.sgt;
      if ($scope.gtswitchState == false) {
        var data = {};
        data["url"] = plugApiService.getApi('deleteGreetingTextFromFbApi');
        data["type"] = 'Greeting Text';
        $rootScope.$broadcast('deleteMessengerProfileEntry',data);
          // $scope.deleteMenuFromFb(plugApiService.getApi('deleteGetStartedFromFbApi'), 'Get Started Button');
        $scope.updateGreetingTextStatus("inactive");
      }
      if ($scope.gtswitchState == true) {
          $scope.updateGreetingTextStatus("active");
      }
  };

  $scope.updateGreetingTextStatus = function(status) {
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
      obj["status"] = status;
      $scope.currentMessengerProfile["status"] = status;
      var url = plugApiService.getApi('setPersistentMenuApi');

      $http({
              method: 'POST',
              url: url,
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              console.log(response);
              if (response.errorMessage) {

                  alertService.addAlert("Unable to update the status of Get Started Button", "err");
                  if (status == "active") {
                      $scope.sgt = false;
                      $scope.gtswitchState = false;

                  } else {
                      $scope.gtswitchState = true;
                      $scope.sgt = true;

                  }


              } else {
                  if (status == "inactive") {
                      $scope.sgt = false;
                      $scope.gtswitchState = false;

                  } else {
                      $scope.gtswitchState = true;
                      $scope.sgt = true;

                  }
                  for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                      if (Object.keys($scope.messengerProfiles[k]).indexOf('text') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                          $scope.messengerProfiles[k] = obj;
                      }
                  }
                  alertService.addAlert("Successfully updated the status of Get Started button.", "succ");
              }
          });
  };

  $scope.saveGreetingText = function() {
      $scope.showGreetingSaveLoader = true;
      var isExist = messengerProfileService.checkGreetingTextExists();
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      if (isExist == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gtswitchState == true) {
              obj["status"] = 'active';
          } else {
              obj["status"] = 'inactive';
          }
      }else{
        obj["status"] = 'active';
      }

      var url = plugApiService.getApi('setPersistentMenuApi');

      $http({
              method: 'POST',
              url: url,
              data: obj,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.showGreetingSaveLoader = false;
              if (response.errorMessage) {
                  alertService.addAlert("Something went wrong.Please try again later.", "err");
              } else {

                  if (Object.keys(obj).indexOf("ProfileID") < 0) {
                      obj["ProfileID"] = response.ProfileID;
                      $scope.isPublishableBtn = true;
                      $scope.messengerProfiles.push(obj);
                      $scope.currentMessengerProfile = {};
                      $scope.currentMessengerProfile = obj;
                      $rootScope.$broadcast('updateMessengerProfiles');
                      alertService.addAlert("Greeting Text saved.", "succ");
                  } else {
                      for (var k = 0; k < $scope.messengerProfiles.length; k++) {

                          if (Object.keys($scope.messengerProfiles[k]).indexOf('text') >= 0 && $scope.messengerProfiles[k].ProfileID == obj["ProfileID"]) {
                              $scope.messengerProfiles[k] = obj;
                              $scope.currentMessengerProfile = {};
                              $scope.currentMessengerProfile = obj;
                          }
                          messengerProfileService.setMessengerProfiles($scope.messengerProfiles);
                          $rootScope.$broadcast('updateMessengerProfiles');
                          alertService.addAlert("Greeting Text updated.", "succ");
                      }
                  }
              }
          });
  };

  $scope.publishGreetingText = function() {
      var flag = messengerProfileService.checkGreetingTextExists();
      var msg = {};
      var obj = {};
      obj["PageID"] = $scope.selectedPage.page_id;
      obj["plug_user_name"] = $scope.userData.userName;
      obj["plug_user_email"] = $scope.userData.userEmail;
      obj["text"] = $scope.greetingMsg;
      obj["Type"] = "greeting";
      if (flag == true) {
          obj["ProfileID"] = $scope.currentMessengerProfile["ProfileID"];
          if ($scope.gtswitchState == true) {
              obj["status"] = 'active';
              $scope.publishGreeting(obj);
          }else {
            $scope.showDisableModal();
          }
      }
  };

  var disablePublishModal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/disablePublishforMessengerProfileModal',
        scope: $scope
      });
  };

  $scope.showDisableModal = function(){
    disablePublishModal().result
      .then(function(){
             console.log("result functiuon");
           });
  };

  $scope.closeModal = function(){
    $scope.modalInstance.close('ok');
  };
  $scope.publishGreeting = function(obj) {
      var ob = obj;
      //  console.log(ob);
      $scope.publishLoader = true;
      var url = plugApiService.getApi('setGreetingTextApi');
      $http({
              method: 'POST',
              url: url,
              data: ob,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .success(function(response) {
              $scope.publishLoader = false;
              if (response.errorMessage) {
                  alertService.addAlert("Something went wrong.Please try again later", "err");

              } else {

                  alertService.addAlert("Get started button published", "succ");

              }
          });
  };

}]);

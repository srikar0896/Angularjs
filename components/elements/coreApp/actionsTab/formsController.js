var app = angular.module('plugApp');

app.controller('formsController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','menuService','messengerProfileService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,menuService,
  messengerProfileService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';
  $scope.showDeleteLoader = false;
  $scope.activeActionId = '';
  $scope.all=[];
  $scope.menuButtons = [];
  $scope.actionHierarchyList = [];
  // $scope.menuBtnName = '';
  $scope.actionsAndCategoriesService = actionsAndCategoriesService;

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.activeActionId = '';
    $scope.activeForm = '';
    $scope.activeButtonForm = '';
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $scope.setMessengerProfiles();
    $scope.actionHierarchyList = [];
  });

  $rootScope.$on("updateMessengerProfiles", function(){
    $scope.messengerProfiles = messengerProfileService.getMessengerProfiles();
  });

  $rootScope.$on("viewAction", function(event,data){
    $scope.viewAction(data.actId,data.catId);
  });

  $rootScope.$on("deleteMessengerProfileEntry", function(event,data){
    $scope.deleteMessengerProfileEntry(data.url,data.type);
  });

  $rootScope.$on("openMessengerProfile", function(event,data){
    if(data.profile_type == 'persistentMenu'){
      $scope.activeForm = 'persistentMenuForm'
    }
    if(data.profile_type == 'greetingText'){
      $scope.activeForm = 'greetingTextForm';
    }
    if(data.profile_type == 'getStartedButton'){
      $scope.activeForm = 'getStartedButtonForm';
    }

  });

  $rootScope.$on("closeForm", function(){
    $scope.activeForm = '';
    $scope.activeButtonForm = '';
  });

  $rootScope.$on("openForm", function(event,args){
    $scope.activeForm = args.formName;
  });

  $rootScope.$on("openButtonForm", function(event,args){
    $scope.activeButtonForm = args.formName;
    $scope.mode = 'addMode';
    $scope.menuBtnName = '';
    $scope.url = '';
    $scope.contactNumber = '';
    $("#menuActions").chosen().val('').trigger('chosen:updated');

    if(args.formName == 'usageForm'){
      $scope.actionHierarchyList = actionsAndCategoriesService.getHeirarchyOfAction(actionsAndCategoriesService.getActiveActionId());
    }
    if(args.formName == 'addNotesForm'){
      $scope.notes = '';
      $scope.activeButtonForm = 'addNotesForm';
      for (var x = 0; x < $scope.all.length; x++) {
          for (var y = 0; y < $scope.all[x].actions.length; y++) {
              if ($scope.all[x].actions[y].ActionID == actionsAndCategoriesService.getActiveActionId()) {
                  if (Object.keys($scope.all[x].actions[y]).indexOf('Notes') > -1) { //Notes present
                      if ($scope.all[x].actions[y].Notes != 'null') {
                          $scope.notes = $scope.all[x].actions[y].Notes;
                      }
                  }
              }
          }
      }

    }
  });

  $scope.saveNotes = function(id) {
      $scope.notesLoader = true;
      var notes = $scope.notes;
      if (notes.length > 0) {
          var newAction = {
              PageID: $scope.selectedPage.page_id,
              ActionID: actionsAndCategoriesService.getActiveActionId(),
              Notes: notes,
              Type: 'text'
          };
          $http({
                  method: 'PUT',
                  url: plugApiService.getApi('getAllApi') + '/action',
                  data: newAction,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  if (response.errorMessage) {
                      alertService.addAlert("Unable to add notes to " + actionsAndCategoriesService.getActionNameById(newAction.ActionID) + " action.", "err");
                  } else {
                      $scope.activeButtonForm = '';
                      $scope.notesLoader = false;
                      for (var x = 0; x < $scope.all.length; x++) {
                          for (var y = 0; y < $scope.all[x].actions.length; y++) {
                              if ($scope.all[x].actions[y].ActionID == id) {
                                  $scope.all[x].actions[y].Notes = $scope.notes;
                                  actionsAndCategoriesService.setActionsAndCategries($scope.all);
                                  $rootScope.$broadcast('updateActionsAndCategories');
                              }
                          }
                      }
                      alertService.addAlert("Successfully added notes to " + actionsAndCategoriesService.getActionNameById(newAction.ActionID) + " action.", "succ");
                  }
              });
      } else {
          $scope.activeButtonForm = '';
      }
  };

  $rootScope.$on("updateMenuButtons", function(){
    $scope.menuButtons = menuService.getMenuButtons();
    $scope.menuBtnName = '';
    $scope.newButtonOption = true;
  });

  $rootScope.$on("viewButton", function(event,data){
    $scope.deletedActions = [];
    // $scope.inactiveChoicePresent = false;
    $scope.mode = 'editMode';

    $scope.menuBtnName = '';
    $scope.url = '';
    $scope.contactNumber = '';
    $("#menuActions").chosen().val('').trigger('chosen:updated');
    $scope.activeButtonForm = 'addButtonForm';
    var obj = data["menuButtons"];
    $scope.currentButtonIndex = data["buttonIndex"];
    $scope.menuBtnName = obj.Name;
    if (obj.type == 'phone_number') {
        $('#addTabs a[data-target="#tab3"]').tab('show');
        $scope.contactNumber = obj.payload;
    }
    if (obj.type == 'web_url') {
        $('#addTabs a[data-target="#tab2"]').tab('show');
        $scope.url = obj.url.substring(8);
    }
    if (Object.keys(obj).indexOf('type') == -1) {
        $('#addTabs a[data-target="#tab1"]').tab('show');
        var arr = [];
        for (var i = 0; i < obj.actions.length; i++) {

            arr.push(obj.actions[i].ActionID);
                if (actionsAndCategoriesService.isActionPresent(obj.actions[i].ActionID) == false) {
                    $scope.inactiveChoicePresent = true;
                    var ob = {};
                    ob["value"] = obj.actions[i].ActionID;
                    ob["name"] = obj.actions[i].ActionName;
                    $scope.deletedActions.push(ob);

                }
        }

        $("#menuActions").chosen().val(arr).trigger('chosen:updated');
    }

  });

  $scope.updateFakeButtonName = function(){
    var data = {};
    data["name"] = $scope.menuBtnName;
    $rootScope.$broadcast('updateFakeButtonName',data);
  };

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

  var actionDeletionModal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/deleteModal',
        scope: $scope
      });
  };

  $scope.deleteAction = function(){
    $scope.actionHierarchyList = [];
    $scope.actionHierarchyList = actionsAndCategoriesService.getHeirarchyOfAction(actionsAndCategoriesService.getActiveActionId());
    actionDeletionModal().result
      .then(function(){
             console.log("result functiuon");
           });
  };

  $scope.confirmDeletion = function(){
    $scope.showDeleteLoader = true;
    var actionId = actionsAndCategoriesService.getActiveActionId();
    var url = plugApiService.getApi('getAllApi') + '/action?pageid=' + $scope.selectedPage.page_id + "&actionid=" + actionId;
    console.log(url);
          $http({
                method: 'DELETE',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
              $scope.showDeleteLoader = false;
              if(response.errorMessage){
                alertService.addAlert("Problem deleting the Action.", "err");
                  $scope.modalInstance.close('confirmed deletion');
              }else{
                $scope.modalInstance.close('confirmed deletion');
                alertService.addAlert("Action deleted successfully.", "succ");
                for (var i = 0; i < $scope.all.length; i++) {
                    for (var j = 0; j < $scope.all[i].actions.length; j++) {
                        if (actionId == $scope.all[i].actions[j].ActionID) {
                              $rootScope.$broadcast("closeForm");
                            if ($scope.all[i].actions[j].Type == 'image') {
                                if ($scope.checkUrl($scope.all[i].actions[j].plugURL) == false); {
                                    var str = $scope.all[i].actions[j].plugURL;
                                    var name = str.split("/");
                                    var component = name[name.length - 1];

                                    $scope.deleteImageS3(component);
                                }
                            }
                            $scope.all[i].actions.splice(j, 1);
                            actionsAndCategoriesService.setActionsAndCategries($scope.all);
                            $rootScope.$broadcast('updateActionsAndCategories');
                        }

                      }
                    }
                }
                //$scope.inactiveAfterDeletion();
            });

  };

  $scope.checkUrl = function(image) {
      for (var i = 0; i < $scope.all.length; i++) {
          for (var j = 0; j < $scope.all[i].actions.length; j++) {
              if (image == $scope.all[i].actions[j].plugURL) {
                  return true;
              } else {
                  return false;
              }
          }
      }
  };

  $scope.cancel = function(){
    console.log("cancelled");
    $scope.modalInstance.dismiss('cancelled deletion');
  };

  $scope.viewAction = function(actionId, catId) {
    var data = {};
    actionsAndCategoriesService.setSelectedCategory(catId);
    actionsAndCategoriesService.setActiveActionId(actionId);
    if(actionId!= 'createNew'){
      $('#blah2').attr('src', '');
      $scope.previewImage = '';
      $scope.previewImageTwo = '';
      $scope.activeActionId = actionId;
      $scope.activeButtonForm = '';
      for (var i = 0; i < $scope.all.length; i++) {
          if (catId == $scope.all[i].CategoryID) {
            $scope.actionCat = $scope.all[i].Name;
              for (var j = 0; j < $scope.all[i].actions.length; j++) {
                  if (actionId == $scope.all[i].actions[j].ActionID) {
                    if ($scope.all[i].actions[j].Type == 'text') {
                        data["formName"] = 'editTextForm';
                        $rootScope.$broadcast("openForm",data);
                      }
                      if($scope.all[i].actions[j].Type == 'superaction'){
                        data["formName"] = 'editSuperActionForm';
                        $rootScope.$broadcast("openForm",data);
                      }

                      if($scope.all[i].actions[j].Type == 'menu'){
                        data["formName"] = 'editMenuForm';
                        $scope.menuButtons = [];
                        menuService.setMenuButtons([]);
                        $rootScope.$broadcast("openForm",data);
                      }

                      if($scope.all[i].actions[j].Type == 'image'){
                        data["formName"] = 'editImageForm';
                        $rootScope.$broadcast("openForm",data);
                      }
                  }
              }
          }
      }

    }else{
      $scope.createNewAction(catId);
    }
  };

    $scope.createNewAction = function(catId) {
        // $scope.selectedCatName = actionsAndCategoriesService.getCategoryNameById(actionsAndCategoriesService.getSelectedCategory());
        $('#blah').attr('src', '');
        $scope.activeForm = 'typeSelectorForm';
        $scope.activeActionId = '';
        $scope.activeButtonForm = '';
        $scope.activeAction = '';

        $("#superActions").chosen().val('');
        $("#editSuperActions").val('');
        $("#menuActions").chosen().val('');

    };

    $scope.saveTextMenuButton = function() {
        $scope.newButtonOption = true;
        $scope.changeNewButtonOption = true;
        $scope.menuButton = {};
        var buttonName = $scope.menuBtnName;
        var buttonActions = $('#menuActions').getSelectionOrder();
        $scope.menuButton['Name'] = buttonName.trim();
        $scope.menuButton["actions"] = [];
        for (var x = 0; x < buttonActions.length; x++) {
            var c = {};
            for (var y = 0; y < $scope.all.length; y++) {
                for (var z = 0; z < $scope.all[y].actions.length; z++) {
                    if (buttonActions[x] == $scope.all[y].actions[z].ActionID) {
                        c.ActionID = buttonActions[x];
                        for (var a = 0; a < $scope.all.length; a++) {
                            for (var b = 0; b < $scope.all[a].actions.length; b++) {
                                if (c.ActionID == $scope.all[a].actions[b].ActionID) {
                                    c.ActionName = $scope.all[a].actions[b].ActionName;
                                }
                            }
                        }
                    }
                }
            }
            $scope.menuButton["actions"].push(c);
        }
        $("#menuBtnSelectSave").addClass("disabled");
        $scope.menuButtons = menuService.getMenuButtons();
        console.log($scope.menuButtons);
        $scope.menuButtons.push($scope.menuButton);
        //$scope.closeMenuButtonForm();
        // $scope.menuButtonNumber = $scope.menuButtonNumber + 1;
        $("#menuActions").chosen().val('').trigger('chosen:updated');
        // $scope.currentButton = -1;
        $scope.activeButtonForm = '';
        $scope.updateMenuButtons();

    };
  $scope.closeMenuButtonForm = function(){
      $scope.activeButtonForm = '';
  };

  $scope.saveUrlMenuButton = function() {
    $scope.newButtonOption = true;
    $scope.menuButton = {
        "type": "web_url"
    };
    var userInputUrl = $scope.url;
    var substr = "https://";

    if (userInputUrl.includes(substr)) {
        var url = $scope.url;
    } else {
        var url = "https://" + $scope.url;
    }
    var buttonName = $("#menuButtonName").val();
    $scope.menuButton['Name'] = buttonName.trim();
    $scope.menuButton['url'] = url;
    $scope.whitelistUrl(url);
    $scope.menuButtons.push($scope.menuButton);
    $scope.updateMenuButtons();
    $scope.activeButtonForm = '';
};

$scope.saveCallMenuButton = function() {
    $scope.newButtonOption = true;
    $scope.menuButton = {
        "type": "phone_number"

    };
    var buttonName = $("#menuButtonName").val();
    var numberInput = $("#inputNumber").val();
    $scope.menuButton['Name'] = buttonName.trim();
    $scope.menuButton['payload'] = numberInput;
    $scope.menuButtons.push($scope.menuButton);
    $scope.activeButtonForm = '';
    $scope.updateMenuButtons();
};

$scope.updateTextMenuButton = function() {
    $scope.newButtonOption = true;
    var menuButton = {};
    var buttonName = $scope.menuBtnName;
    var buttonActions = $('#menuActions').chosen().val();
    console.log(buttonActions);
    if (buttonActions && buttonActions.length > 0) {
        menuButton['Name'] = buttonName.trim();
        menuButton["actions"] = [];
        for (var x = 0; x < buttonActions.length; x++) {
            var c = {};
            for (var y = 0; y < $scope.all.length; y++) {
                for (var z = 0; z < $scope.all[y].actions.length; z++) {
                    if (buttonActions[x] == $scope.all[y].actions[z].ActionID) {
                        c.ActionID = buttonActions[x];
                        for (var a = 0; a < $scope.all.length; a++) {
                            for (var b = 0; b < $scope.all[a].actions.length; b++) {
                                if (c.ActionID == $scope.all[a].actions[b].ActionID) {
                                    c.ActionName = $scope.all[a].actions[b].ActionName;
                                }
                            }
                        }

                    }
                }
            }
            menuButton["actions"].push(c);
        }
        $scope.menuButtons[$scope.currentButtonIndex] = menuButton;
        $scope.updateMenuButtons();
    }else{
      $scope.activeButtonForm = '';
    }

};

$scope.updateUrlMenuButton = function() {
    $scope.newButtonOption = true;
    var menuButton = {};
    var buttonName = $scope.menuBtnName;

    menuButton['Name'] = buttonName.trim();
    menuButton['type'] = 'web_url';

    var inputUrl = $scope.url;
    var substr = "https://";

    if (inputUrl.includes(substr)) {

        var url = $scope.url;
    } else {

        var url = "https://" + $scope.url;
    }
    menuButton['url'] = url;
    $scope.whitelistUrl(url);

    $scope.menuButtons[$scope.currentButtonIndex] = menuButton;
    $scope.updateMenuButtons();
};

$scope.updateCallMenuButton = function() {
    $scope.newButtonOption = true;
    var menuButton = {};
    var buttonName = $scope.menuBtnName;

    menuButton['Name'] = buttonName.trim();
    menuButton['type'] = 'phone_number';
    menuButton['payload'] = $scope.contactNumber;


    $scope.menuButtons[$scope.currentButtonIndex] = menuButton;
    $scope.updateMenuButtons();
};


$scope.updateMenuButtons = function(){
  $scope.activeButtonForm = '';
  console.log($scope.menuButtons);
  menuService.setMenuButtons($scope.menuButtons);
  $rootScope.$broadcast("updateMenuButtons");
};

$scope.whitelistUrl = function(url) {
    var obj = {};
    var whiteListArray = [];
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

            if (response!='null') {
                alertService.addAlert("Something went wrong. Please try again later.", "err");
                return false;
            }
        });

};
var buttonDeletionModal = function(){
  return $scope.modalInstance = $uibModal.open({
      templateUrl: 'modals/buttonDeleteModal',
      scope: $scope
    });
};

$scope.deleteMenuButton = function(){
  buttonDeletionModal().result
    .then(function(){
           console.log("result functiuon");
         });
};

$scope.confirmMenuButtonDeletion = function(){
    $scope.menuButtons.splice($scope.currentButtonIndex, 1);
    $scope.updateMenuButtons();
    $scope.modalInstance.close('confirmed deletion');
};

$scope.setMessengerProfiles = function(){
  var url = plugApiService.getApi('getMessengerProfileApi');
  var obj = {};
  obj["PageID"] = $scope.selectedPage.page_id;

  $http({
          method: 'POST',
          url: url,
          data: obj,
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(function(response) {
          if (response.data.errorMessage) {
              alertService.addAlert("Error in getting persistantMenus.", "err");
          } else {
              messengerProfileService.setMessengerProfiles(response.data);
          }
      });
};

  $scope.deleteMessengerProfileEntry = function(url,type){
    if (Object.keys(messengerProfileService.getCurrentMessengerProfile).indexOf("ProfileID") >= 0) {
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
                if (response.result == 'success') {
                    alertService.addAlert("Deleted " + type + " from facebook.", "succ");
                } else {
                    $scope.secondDeletionFromFB(obj, url, type);
                }
            });
    }
  };

  $scope.secondDeletionFromFB = function(obj, url, type) {
  if (Object.keys(messengerProfileService.getCurrentMessengerProfile).indexOf("ProfileID") >= 0) {
          $http({
                  method: 'POST',
                  url: url,
                  data: obj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  if (response.result == 'success') {
                      alertService.addAlert("Deleted " + type + " from facebook.", "succ");
                  } else {
                      alertService.addAlert("Something went wrong. Please try again later.", "err");
                  }
              });
      }
  };

  $scope.clicked = function(id, index) {
      if ($(".collapse" + index + id).hasClass("dd-collapsed")) {
          $(".collapse" + index + id).removeClass("dd-collapsed");
      } else {
          $(".collapse" + index + id).addClass("dd-collapsed")
      }
  };

/*Script for chosen order - Must be inside the parent scope*/

    (function() {
    var a, b, c, d = [].indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        },
        e = {}.hasOwnProperty,
        f = function(a, b) {
            function c() {
                this.constructor = a
            }
            for (var d in b) e.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
        };
    b = function() {
        function a() {}
        var b;
        return b = {
            invalid_select_element: "ChosenOrder::{{function}}: first argument must be a valid HTML Multiple Select element that has been Chosenified!",
            invalid_selection_array: "ChosenOrder::{{function}}: second argument must be an Array!",
            unreachable_chosen_container: 'ChosenOrder::{{function}}: could not find the Chosen UI container! To solve the problem, try adding an "id" attribute to your <select> element.'
        }, a.insertAt = function(a, b, c) {
            return c.insertBefore(a, c.children[b].nextSibling)
        }, a.getFlattenedOptionsAndGroups = function(a) {
            var b, c, d, e, f, g, h, i, j;
            for (d = Array.prototype.filter.call(a.childNodes, function(a) {
                    var b;
                    return "OPTION" === (b = a.nodeName.toUpperCase()) || "OPTGROUP" === b
                }), b = [], g = 0, i = d.length; i > g; g++)
                if (c = d[g], b.push(c), "OPTGROUP" === c.nodeName.toUpperCase())
                    for (f = Array.prototype.filter.call(c.childNodes, function(a) {
                            return "OPTION" === a.nodeName.toUpperCase()
                        }), h = 0, j = f.length; j > h; h++) e = f[h], b.push(e);
            return b
        }, a.isValidMultipleSelectElement = function(a) {
            return null !== a && "undefined" != typeof a && "SELECT" === a.nodeName && a.multiple
        }, a.getChosenUIContainer = function(a) {
            return "" !== a.id ? document.getElementById(a.id.replace(/-/g, "_") + "_chosen") : this.searchChosenUIContainer(a)
        }, a.isChosenified = function(a) {
            return null != this.getChosenUIContainer(a)
        }, a.forceSelection = function(a, b) {
            var c, e, f, g;
            for (f = this.getFlattenedOptionsAndGroups(a), c = 0; c < f.length;) e = f[c], g = e.getAttribute("value"), d.call(b, g) >= 0 ? (e.selected = !0, e.setAttribute("selected", "")) : (e.selected = !1, e.removeAttribute("selected")), c++;
            return this.triggerEvent(a, "chosen:updated")
        }, a.getSelectionOrder = function(a) {
            var c, d, e, f, g, h, i, j, k, l;
            if (null != this.getDOMElement && (a = this.getDOMElement(a)), i = [], !this.isValidMultipleSelectElement(a)) return console.error(b.invalid_select_element.replace("{{function}}", "getSelectionOrder")), i;
            if (d = this.getChosenUIContainer(a), null == d) return console.error(b.unreachable_chosen_container.replace("{{function}}", "getSelectionOrder")), i;
            for (c = d.querySelectorAll(".search-choice"), h = this.getFlattenedOptionsAndGroups(a), k = 0, l = c.length; l > k; k++) f = c[k], e = f.querySelectorAll(".search-choice-close")[0], null != e && (j = e.getAttribute(this.relAttributeName)), g = h[j], i.push(g.value);
            return i
        }, a.setSelectionOrder = function(a, c, d) {
            var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
            if (null != this.getDOMElement && (a = this.getDOMElement(a)), !this.isValidMultipleSelectElement(a)) return void console.error(b.invalid_select_element.replace("{{function}}", "setSelectionOrder"));
            if (g = this.getChosenUIContainer(a), null == g) return void console.error(b.unreachable_chosen_container.replace("{{function}}", "setSelectionOrder"));
            if (c instanceof Array) {
                for (c = c.map(Function.prototype.call, String.prototype.trim), m = this.getFlattenedOptionsAndGroups(a), null != d && d === !0 && this.forceSelection(a, c), t = [], h = p = 0, r = c.length; r > p; h = ++p) {
                    for (k = c[h], n = null, i = q = 0, s = m.length; s > q; i = ++q) j = m[i], j.value === k && (n = i);
                    f = g.querySelectorAll(".search-choice"), o = this.relAttributeName, l = Array.prototype.filter.call(f, function(a) {
                        return null != a.querySelector("a.search-choice-close[" + o + '="' + n + '"]')
                    })[0], e = g.querySelector("ul.chosen-choices"), t.push(this.insertAt(l, h, g.querySelector("ul.chosen-choices")))
                }
                return t
            }
            return console.error(b.invalid_selection_array.replace("{{function}}", "setSelectionOrder"))
        }, a
    }(), a = jQuery, a.fn.extend({
        getSelectionOrder: function() {
            return ChosenOrder.getSelectionOrder(this)
        },
        setSelectionOrder: function(a, b) {
            return ChosenOrder.setSelectionOrder(this, a, b)
        }
    }), this.ChosenOrder = function(b) {
        function d() {
            return c = d.__super__.constructor.apply(this, arguments)
        }
        return f(d, b), d.relAttributeName = "data-option-array-index", d.isjQueryObject = function(a) {
            return "undefined" != typeof jQuery && null !== jQuery && a instanceof jQuery
        }, d.getDOMElement = function(a) {
            return this.isjQueryObject(a) ? a.get(0) : a
        }, d.searchChosenUIContainer = function(b) {
            return null != a(b).data("chosen") ? a(b).data("chosen").container[0] : a(b).next(".chosen-container.chosen-container-multi").get(0)
        }, d.triggerEvent = function(b, c) {
            return a(b).trigger(c)
        }, d
    }(b)
}).call(this);

}]);

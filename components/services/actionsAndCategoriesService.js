var app = angular.module('plugApp');
app.service("actionsAndCategoriesService", function(){
var all = [];
var actionIDS = [];
var catIDS = [];
var activeActionId ='';
var selectedCat = '';
var actionHierarchyList = [];
var inactiveElementsArray = [];

getParentsOfAnAction = function(actId) {
    var parents = [];
    var o = {};
    for (var x = 0; x < all.length; x++) {
        for (var y = 0; y < all[x].actions.length; y++) {
            if (all[x].actions[y].Type == 'superaction') {
                o = {};
                var i = 0;
                for (var k = 0; k < 3; k++) {
                    if (all[x].actions[y]["Action" + k].ActionID == actId) {
                        i++;
                        parents.push(all[x].actions[y].ActionID);
                    }
                }
            }
            if (all[x].actions[y].Type == 'menu') {
                o = {};
                for (var l = 0; l < 3; l++) {
                    if (all[x].actions[y]["Button" + l] != 'null') {
                        if (Object.keys(all[x].actions[y]["Button" + l]).indexOf('type') == -1) {
                            for (var p = 0; p < all[x].actions[y]["Button" + l].actions.length; p++) {
                                if (all[x].actions[y]["Button" + l].actions[p].ActionID == actId) {
                                    parents.push(all[x].actions[y].ActionID);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return parents;
};

isActionPresent = function(id){
  var flag = false;
  for (var i = 0; i < all.length; i++) {
      for (var j = 0; j < all[i].actions.length; j++) {
          if (all[i].actions[j].ActionID == id) {

              flag = true;
          }
      }
  }
  return flag;
};

getHeirarchyOfAction = function(actId) {
    actionHierarchyList = [];
    var orgParents = getParentsOfAnAction(actId);
    var myArr = [];
    var obj = {};
    obj["id"] = actId;
    obj["name"] = getActionNameById(actId);
    obj["children"] = [];
    recurse(obj,orgParents);
    return actionHierarchyList;
};

returnTypeById = function(id) {
    for (var i = 0; i < all.length; i++) {
        for (var j = 0; j < all[i].actions.length; j++) {
            if (all[i].actions[j].ActionID == id) {
                var type = returnType(all[i].actions[j].Type);
            }
        }
    }
    return type;
};

returnType = function(x) {
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
recurse = function(obj,orgParents){
  for (var i = 0; i < orgParents.length; i++) {
      var i_obj = {};
      var i_temp = obj;
      i_obj["id"] = orgParents[i];
      i_obj["name"] = getActionNameById(orgParents[i]);
      i_obj["children"] = [];
      i_obj["children"].push(i_temp);
      var nextLevelParents = getParentsOfAnAction(orgParents[i]);
      if (nextLevelParents.length > 0) {
        recurse(i_obj,nextLevelParents);
      }else{
        actionHierarchyList.push(i_obj);
      }
    }
};

getActionNameById = function(id){
  for (var i = 0; i < all.length; i++) {
      for (var j = 0; j < all[i].actions.length; j++) {
          if (all[i].actions[j].ActionID == id) {
              return all[i].actions[j].ActionName;
          }
      }
  }

};

setButtonStatus = function(id, st) {
    if (st == 'active') {
        if (inactiveElementsArray.indexOf(id) >= 0) {
            inactiveElementsArray.splice(inactiveElementsArray.indexOf(id), 1);
        }
    } else {
        inactiveElementsArray.push(id);
    }
};

getStatusOfAction = function(id) {
    if (isActionPresent(id)) {
        for (var i = 0; i < all.length; i++) {
            for (var j = 0; j < all[i].actions.length; j++) {
                if (all[i].actions[j].ActionID == id) {
                    return all[i].actions[j].status;
                }
            }
        }
    }
};

setStatusOfAction = function(id, st) {
    setButtonStatus(id, st);
    for (var i = 0; i < all.length; i++) {
        for (var j = 0; j < all[i].actions.length; j++) {
            if (all[i].actions[j].ActionID == id) {
                all[i].actions[j].status = st;
            }
        }
    }
};

checkActivation = function(id) {
    var flag = true;
    for (var i = 0; i < all.length; i++) {
        for (var j = 0; j < all[i].actions.length; j++) {
            if (all[i].actions[j].ActionID == id) {
                if (all[i].actions[j].Type == 'menu') {
                    for (var uc = 0; uc < 3; uc++) {
                        if (all[i].actions[j]["Button" + uc] != 'null') {
                            if (Object.keys(all[i].actions[j]["Button" + uc]).indexOf('actions') == -1) {

                            } else {
                                if (flag) {

                                    if (isActionPresent(all[i].actions[j]["Button" + uc].actions[0].ActionID) && (getStatusOfAction(all[i].actions[j]["Button" + uc].actions[0].ActionID) == 'active' || typeof getStatusOfAction(all[i].actions[j]["Button" + uc].actions[0].ActionID) == 'undefined')){

                                        flag = true;
                                    } else {

                                        flag = false;
                                        setStatusOfAction (id, "inactive");
                                        inactivateParentsOfAction(id);
                                        // console.log("--------------------");
                                        // console.log(getActionNameById(id));
                                        // console.log(isActionPresent(all[i].actions[j]["Button" + uc].actions[0].ActionID));
                                        // console.log(getStatusOfAction(all[i].actions[j]["Button" + uc].actions[0].ActionID));
                                        // console.log(all[i].actions[j]["Button" + uc].actions[0].ActionName);
                                    }
                                }
                            }
                        }
                        if (uc == 2) {

                            if (flag == true) {
                                setStatusOfAction (id, "active");

                            }
                        }
                    }
                }
                if (all[i].actions[j].Type == 'superaction') {

                    for (var us = 0; us < 3; us++) {

                        if (all[i].actions[j]["Action" + us] != 'null') {
                            if (flag) {

                                if (isActionPresent(all[i].actions[j]["Action" + us].ActionID) && (getStatusOfAction(all[i].actions[j]["Action" + us].ActionID) == 'active' || typeof getStatusOfAction(all[i].actions[j]["Action" + us].ActionID) == 'undefined')) {

                                    flag = true;
                                } else {
                                  // console.log("--------------------");
                                  // console.log(getActionNameById(id));
                                  // console.log(isActionPresent(all[i].actions[j]["Action" + us].ActionID));
                                  // console.log(getStatusOfAction(all[i].actions[j]["Action" + us].ActionID));
                                  // console.log(all[i].actions[j]["Action" + us].ActionName);
                                    setStatusOfAction (id, "inactive");
                                    inactivateParentsOfAction(id);
                                    flag = false;
                                }


                            }
                        }
                        if (us == 2) {
                            if (flag == true) {
                                setStatusOfAction (id, "active");
                            }
                        }
                    }
                }
            }
        }
    }

};

inactivateParentsOfAction = function(id) {
    var newParentsList = getHeirarchyOfAction(id);
    for (var a = 0; a < newParentsList.length; a++) {
        setStatusOfAction(newParentsList[a].id,'inactive');
        var aChildren = newParentsList[a].children;
        if (aChildren.length > 0) {
            for (var b = 0; b < aChildren.length; b++) {
                setStatusOfAction(aChildren[b].id,'inactive');
                var bChildren = aChildren[b].children;
                if (bChildren.length > 0) {
                    for (var c = 0; c < bChildren.length; c++) {
                        setStatusOfAction(bChildren[c].id,'inactive');
                        var cChildren = bChildren[c].children;
                        if (cChildren.length > 0) {
                            for (var d = 0; d < cChildren.length; d++) {
                                setStatusOfAction(cChildren[d].id,'inactive');
                                var dChildren = cChildren[d].children;
                                if (dChildren.length > 0) {
                                    for (var e = 0; e < dChildren.length; e++) {
                                        setStatusOfAction(dChildren[e].id,'inactive');
                                        var eChildren = dChildren[e].children;
                                        if (eChildren.length > 0) {
                                            for (var f = 0; f < eChildren.length; f++) {
                                                setStatusOfAction(eChildren[f].id,'inactive');
                                                var fChildren = eChildren[f].children;
                                                if (fChildren.length > 0) {
                                                    for (var g = 0; g < fChildren.length; g++) {
                                                        setStatusOfAction(fChildren[g].id,'inactive');
                                                        var gChildren = fChildren[g].children;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

updateElements = function(){
  if (all.length > 0 && typeof all !== 'undefined') {
      for (var ii = 0; ii < all.length; ii++) {
          for (var jj = 0; jj < all[ii].actions.length; jj++) {
              if (all[ii].actions[jj].Type == 'menu' || all[ii].actions[jj].Type == 'superaction') {
                  checkActivation(all[ii].actions[jj].ActionID);
              }
          }
      }
  }

};
  return {
    setActionsAndCategries : function(obj){
      all = [];
      all = obj;
      actionIDS = [];
      catIDS = [];
      if (all.length > 0 && typeof all !== 'undefined') {
          for (var i = 0; i < all.length; i++) {
            catIDS.push(all[i].CategoryID);
              for (var j = 0; j < all[i].actions.length; j++) {
                  actionIDS.push(all[i].actions[j].ActionID);
                  if (all[i].actions[j].Type == 'menu' || all[i].actions[j].Type == 'superaction') {
                    //  checkActivation(all[i].actions[j].ActionID);
                  } else {
                      all[i].actions[j]["status"] = "active";
                  }
                  if(i == all.length -1 && j == all[all.length -1].actions.length -1){
                    updateElements();
                  }
              }
          }
      }
    },

    getActionsAndCategries : function(){
      return all;
    },
    getActionNameById : function(id){
      for (var i = 0; i < all.length; i++) {
          for (var j = 0; j < all[i].actions.length; j++) {
              if (all[i].actions[j].ActionID == id) {
                  return all[i].actions[j].ActionName;
              }
          }
      }

    },
    checkActionExists : function(actId) {
        if (actionIDS.indexOf(actId) > -1) {
            return true;
        } else {
            return false;
        }
    },
    addNewAction : function(obj){
      console.log(actionIDS);
      if (actionIDS.indexOf(obj.ActionID)<0) {
        for (var i = 0; i < all.length; i++) {
          if (obj.CategoryID == all[i].CategoryID) {
                  all[i].actions.push(obj);
              }
          }
      }
    },
    addNewCategory : function(obj){
      if(catIDS.indexOf(obj.CategoryID)<0){
        all.push(obj);
      }
    },
    getCategoryNameById : function(id){
      for (var i = 0; i < all.length; i++) {
              if (all[i].CategoryID == id) {
                  return all[i].Name;

          }
      }

    },
    setActiveActionId : function(id){
      activeActionId = id;
    },

    getActiveActionId : function(){
      return activeActionId;
    },

    setSelectedCategory : function(id){
      selectedCat = id;
    },

    getSelectedCategory : function(){
      return selectedCat;
    },
    isActionPresent : function(id){
      var flag = false;
      for (var i = 0; i < all.length; i++) {
          for (var j = 0; j < all[i].actions.length; j++) {
              if (all[i].actions[j].ActionID == id) {

                  flag = true;
              }
          }
      }
      return flag;
    },

    getHeirarchyOfAction : function(actId) {
        actionHierarchyList = [];
        var orgParents = getParentsOfAnAction(actId);
        var myArr = [];
        var obj = {};
        obj["id"] = actId;
        obj["name"] = getActionNameById(actId);
        obj["children"] = [];
        recurse(obj,orgParents);
        return actionHierarchyList;
    },
    returnType : function(x) {
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
    },
    returnTypeById : function(id) {
        for (var i = 0; i < all.length; i++) {
            for (var j = 0; j < all[i].actions.length; j++) {
                if (all[i].actions[j].ActionID == id) {
                    var type = returnType(all[i].actions[j].Type);
                }
            }
        }
        return type;
    },

    getStatusOfAction : function(id) {
        if (isActionPresent(id)) {
            for (var i = 0; i < all.length; i++) {
                for (var j = 0; j < all[i].actions.length; j++) {
                    if (all[i].actions[j].ActionID == id) {
                        return all[i].actions[j].status;
                    }
                }
            }
        }
    },

    getInactiveElemets : function(){
      return inactiveElementsArray;
    }

  }

});

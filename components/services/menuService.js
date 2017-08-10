var app = angular.module('plugApp');
app.service('menuService', function() {
  var menuButtons = [];
  return {
    setMenuButtons : function(arr) {
        menuButtons = arr;
    },

    getMenuButtons : function(arr) {
        return menuButtons;
    },

    addMenuButton : function(obj){
      menuButtons.push(obj);
    },

    emptyMenuButtons : function(){
      menuButtons = [];
    }
  }
});

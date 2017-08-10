var app = angular.module('plugApp');

app.factory('capitalizeService',['$rootScope',function($rootScope) {
  var alert = {};
  return {
    capitalizeFirstLetter : function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

  }
}]);

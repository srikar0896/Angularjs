var app = angular.module('plugApp');

app.factory('alertService',['$rootScope',function($rootScope) {
  var alert = {};
  return {

        addAlert: function(message, type) {
          if (type == "err") {
              alert["type"] = "alert-danger";
              alert["icon"] = "icon-times";
          }
          if (type == "succ") {
              alert["type"] ="alert-success";
              alert["icon"] = "icon-check";
          }
          if (type == "notice") {
              alert["type"] ="alert-notice";
              alert["icon"] = "icon-info";

          }
          alert["message"] = message;
          $rootScope.$broadcast("showAlertBar",alert);
        }
    };
}]);

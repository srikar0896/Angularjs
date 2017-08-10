var app = angular.module("plugApp");

app.directive('actionnameValidator',['$q','actionsAndCategoriesService',function($q,actionsAndCategoriesService) {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function(scope, element, attrs, ngModel) {
            scope.$watch(function () {
               return ngModel.$modelValue;
            }, function(newVal,oldVal) {
                if(typeof newVal=='undefined'){
                  scope.showActionNameStatus =false;
                  scope.denySubmitDueName = false;
                }else{
                  var flag = true;
                  scope.showActionNameStatus = true;
                  for (var i = 0; i < actionsAndCategoriesService.getActionsAndCategries().length; i++) {
                    for (var j = 0; j < actionsAndCategoriesService.getActionsAndCategries()[i].actions.length; j++) {
                       if (newVal.toLowerCase() == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].ActionName.toLowerCase()) {
                         flag = false;
                         scope.actionNameNotificationType = 'font-red';
                         scope.actionNameAvailabilty = newVal + ' exists';
                         scope.denySubmitDueName = true;
                       }
                        if(i==actionsAndCategoriesService.getActionsAndCategries().length-1 && j == actionsAndCategoriesService.getActionsAndCategries()[actionsAndCategoriesService.getActionsAndCategries().length-1].actions.length-1){
                          if(flag== true){
                            scope.actionNameNotificationType = 'font-green'; scope.actionNameAvailabilty = newVal + ' available';
                            scope.denySubmitDueName = false;
                            }
                          }
                       }
                    }
                }
            });
         }
      };
 }]);

 app.directive('alternateactionnameValidator',['$q','actionsAndCategoriesService',function($q,actionsAndCategoriesService) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
             scope.$watch(function () {
                return ngModel.$modelValue;
             }, function(newVal,oldVal) {
                 if(typeof newVal=='undefined'){
                   scope.showActionNameStatus =false;
                   scope.denySubmitDueName = false;
                 }else{
                   var flag = true;
                   scope.showActionNameStatus = true;
                   for (var i = 0; i < actionsAndCategoriesService.getActionsAndCategries().length; i++) {
                     for (var j = 0; j < actionsAndCategoriesService.getActionsAndCategries()[i].actions.length; j++) {
                        if (newVal.toLowerCase() == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].ActionName.toLowerCase()) {
                          flag = false;
                          if(actionsAndCategoriesService.getActiveActionId() == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].ActionID){

                            scope.actionNameNotificationType = 'font-red';
                            scope.actionNameAvailabilty = '';
                            scope.denySubmitDueName = false;

                          }else{

                            scope.actionNameNotificationType = 'font-red';
                            scope.actionNameAvailabilty = newVal + ' exists';
                            scope.denySubmitDueName = true;

                          }
                        }
                         if(i==actionsAndCategoriesService.getActionsAndCategries().length-1 && j == actionsAndCategoriesService.getActionsAndCategries()[actionsAndCategoriesService.getActionsAndCategries().length-1].actions.length-1){
                           if(flag== true){
                             scope.actionNameNotificationType = 'font-green'; scope.actionNameAvailabilty = newVal + ' available';
                             scope.denySubmitDueName = false;
                             }
                           }
                        }
                     }
                 }
             });
          }
       };
  }]);

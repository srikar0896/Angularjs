var app = angular.module("plugApp");

 app.directive('shortcutValidator',['$q','actionsAndCategoriesService',function($q,actionsAndCategoriesService) {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function(scope, element, attrs, ngModel) {
            scope.$watch(function () {
               return ngModel.$modelValue;
            }, function(newVal,oldVal) {
                if(typeof newVal =='undefined'){
                  scope.showActionShortcutStatus =false;
                  scope.denySubmitDueSrt = false;
                }else{
                  var flag = true;
                  scope.showActionShortcutStatus = true;
                  if(newVal.length >0 && typeof newVal == 'string'){
                  for (var i = 0; i < actionsAndCategoriesService.getActionsAndCategries().length; i++) {
                    for (var j = 0; j < actionsAndCategoriesService.getActionsAndCategries()[i].actions.length; j++) {
                      if(Object.keys(actionsAndCategoriesService.getActionsAndCategries()[i].actions[j]).indexOf('Shortcut')>-1){
                       if ('//' + newVal == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].Shortcut.toLowerCase()) {
                         flag = false;
                         scope.actionShortcutNotificationType = 'font-red';
                         scope.actionShortcutAvailabilty = '//' + newVal + ' exists';
                         scope.denySubmitDueSrt = true;
                       }
                        if(i==actionsAndCategoriesService.getActionsAndCategries().length-1 && j == actionsAndCategoriesService.getActionsAndCategries()[actionsAndCategoriesService.getActionsAndCategries().length-1].actions.length-1){
                          if(flag== true){
                            scope.actionShortcutNotificationType = 'font-green';
                            scope.actionShortcutAvailabilty = '//' + newVal + ' available';
                            scope.denySubmitDueSrt = false;
                            }
                          }
                        }
                      }
                    }
                  }
                }
            });
         }
      };
 }]);

 app.directive('alternateshortcutValidator',['$q','actionsAndCategoriesService',function($q,actionsAndCategoriesService) {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function(scope, element, attrs, ngModel) {
            scope.$watch(function () {
               return ngModel.$modelValue;
            }, function(newVal,oldVal) {
                if(typeof newVal =='undefined'){
                  scope.showActionShortcutStatus =false;
                  scope.denySubmitDueSrt = false;
                }else{
                  var flag = true;
                  scope.showActionShortcutStatus = true;
                  if(newVal.length >0 && typeof newVal == 'string'){
                  for (var i = 0; i < actionsAndCategoriesService.getActionsAndCategries().length; i++) {
                    for (var j = 0; j < actionsAndCategoriesService.getActionsAndCategries()[i].actions.length; j++) {
                      if(Object.keys(actionsAndCategoriesService.getActionsAndCategries()[i].actions[j]).indexOf('Shortcut')>-1){
                       if ('//' + newVal == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].Shortcut.toLowerCase()) {
                         flag = false;
                         if(actionsAndCategoriesService.getActiveActionId() == actionsAndCategoriesService.getActionsAndCategries()[i].actions[j].ActionID){

                           scope.actionShortcutNotificationType = 'font-red';
                           scope.actionShortcutAvailabilty = '';
                           scope.denySubmitDueSrt = false;

                         }else{

                           scope.actionShortcutNotificationType = 'font-red';
                           scope.actionShortcutAvailabilty = '//' + newVal + ' exists';
                           scope.denySubmitDueSrt = true;
                         }

                       }
                        if(i==actionsAndCategoriesService.getActionsAndCategries().length-1 && j == actionsAndCategoriesService.getActionsAndCategries()[actionsAndCategoriesService.getActionsAndCategries().length-1].actions.length-1){
                          if(flag== true){
                            scope.actionShortcutNotificationType = 'font-green';
                            scope.actionShortcutAvailabilty = '//' + newVal + ' available';
                            scope.denySubmitDueSrt = false;
                            }
                          }
                        }
                      }
                    }
                  }
                }
            });
         }
      };
 }]);

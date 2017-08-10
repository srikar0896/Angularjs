var app = angular.module('plugApp');
app.run(function(editableOptions, editableThemes) {
    editableOptions.theme = 'bs3';
});

app.controller('actionPaletteController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','$q','capitalizeService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService, $q, capitalizeService){

    $scope.all = [];
    $scope.selectedPage = '';
    $scope.showDeleteLoader = false;
    $scope.ShowNewGroupBtn = true;

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    $scope.inactiveElementsArray = actionsAndCategoriesService.getInactiveElemets();
    });

    $rootScope.$on("updatePageContent", function(){
      $scope.selectedPage = fbPagesService.getSelectedPage();
      $scope.all = [];
      $scope.all = actionsAndCategoriesService.getActionsAndCategries();
    });

    $scope.actionsAndCategoriesService = actionsAndCategoriesService;

    $scope.returnType = function(x) {
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

  $scope.viewAction = function(actId,catId){
      var data = {};
      data["actId"] = actId;
      data["catId"] = catId;
      $rootScope.$broadcast("viewAction",data);
  };

  $scope.openMessengerProfile = function(type){
    var data = {};
    data["profile_type"] = type;
    $rootScope.$broadcast("openMessengerProfile",data);
  };
  $scope.checkCategoryExists = function(name) {
      var flag = false;
      for (var i = 0; i < $scope.all.length; i++) {
          if ($scope.all[i].Name.toLowerCase() == name.toLowerCase()) {
              flag = true;
          }
      }
      return flag;
  };
  $scope.createCategory = function(x) {
      var d = $q.defer();
      if (x) {
          if ($scope.checkCategoryExists(x)) {
              d.reject('Server error!');
              alertService.addAlert("Category with this name already exists.", "notice");
          } else {
              var newCat = capitalizeService.capitalizeFirstLetter(x);
              var newCategory = {
                  "Name": newCat,
                  "PageID": $scope.selectedPage.page_id,
              };
              var obj = {
                  Name: newCat,
                  actions: []
              }
              $http({
                      method: 'POST',
                      url: plugApiService.getApi('getAllApi') + '/category',
                      data: newCategory,
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  })
                  .success(function(response) {
                      $scope.all.push(obj);
                      alertService.addAlert("New Category added", "succ")
                      d.resolve();
                      for (var i = 0; i < $scope.all.length; i++) {

                          if ($scope.all[i].Name == newCat && Object.keys($scope.all[i]).indexOf('CategoryID') < 0) {
                              $scope.all[i]['CategoryID'] = response.CategoryID;
                              actionsAndCategoriesService.setActionsAndCategries($scope.all);
                              $rootScope.$broadcast('updateActionsAndCategories');
                          }
                      }

                  })
                  .error(function(e) {
                      d.reject('Server error!');
                  });
              return d.promise;
          }
      }
  };

  var categoryDeletionModal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/categoryDeleteModal',
        scope: $scope
      });
  };

  $scope.deleteCategory = function(id){
    $scope.deleteCatId = id;
    $scope.deletePromptCatName = actionsAndCategoriesService.getCategoryNameById(id);
    categoryDeletionModal().result
      .then(function(){
        //result
            });
  };

  $scope.confirmDeletion = function() {
    $scope.showDeleteLoader = true;
      $http({
              method: 'DELETE',
              url: plugApiService.getApi('getAllApi') + '/category?pageid=' + $scope.selectedPage.page_id + "&categoryid=" + $scope.deleteCatId,
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(function(response) {
            $scope.showDeleteLoader = false;
            $scope.modalInstance.close('confirmed deletion');
              console.log(response);
              for (var i = 0; i < $scope.all.length; i++) {
                  if ($scope.deleteCatId == $scope.all[i].CategoryID) {
                      $scope.all.splice(i, 1);
                      actionsAndCategoriesService.setActionsAndCategries($scope.all);
                      $rootScope.$broadcast('updateActionsAndCategories');
                      if (actionsAndCategoriesService.isActionPresent(actionsAndCategoriesService.getActiveActionId())) {} else {
                          $rootScope.$broadcast('closeForm');
                      }
                  }
              }
          });
  };

  $scope.updateOrderInAll = function(orderArr) {
      $scope.tempArr = [];
      for (var i = 0; i < orderArr.length; i++) {
          if (orderArr[i].pos == i) {
              $scope.swapCatPos(orderArr[i].categoryID, orderArr[i].pos);
          }
      }
      actionsAndCategoriesService.setActionsAndCategries($scope.all);
      $rootScope.$broadcast('updateActionsAndCategories');
  };

  $scope.swapCatPos = function(catId, pos) {
      for (var x = 0; x < $scope.all.length; x++) {
          if ($scope.all[x].CategoryID == catId) {
              $scope.all[x].pos = pos;
          }
      }
  };

  var id = "";
  var sortEventHandler = function(event, ui) {
      $scope.listElements = $("#accordio").children();
      $scope.listValues = {};
      for (var i = 1; i < $scope.listElements.length; i++) {
          id = $scope.listElements[i].lastElementChild.id;
          $scope.listValues[i] = id.slice(4, id.length);
      }
  };

  var stopped = function(event, ui) {
      if ($scope.all.length > 1) {
          $scope.ShowNewGroupBtn = false;
          var order = {};
          var i = 0;
          var arra = [];
          var catPos = {};
          order["pageID"] = $scope.selectedPage.page_id;
          for (i = 1; i < $scope.listElements.length; i++) {
              arra.push({
                  "pos": i.toString(),
                  "categoryID": $scope.listValues[i]
              });
          }
          order["arr"] = arra;
          console.log(order);
          $http({
                  method: 'POST',
                  url: plugApiService.getApi('updateOrderApi'),
                  data: order,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  if (response.errorMessage) {
                      alertService.addAlert("Unable to update the order. Please try again later.", "err");
                  } else {

                      $scope.updateOrderInAll(order["arr"]);

                      alertService.addAlert("Successfully updated the order.", "succ");

                      $scope.ShowNewGroupBtn = true;
                  }
              });
      }
  };

  $("#accordio").sortable({
      connectWith: "#accordio",
      update: sortEventHandler,
      start: function(e, ui) {
          ui.placeholder.height(ui.item.height());
      },
      stop: stopped,
      refreshPositions: true,
      opacity: 0.8,
      scroll: true,
      containment: 'parent',
      placeholder: 'placeholder',
      tolerance: 'pointer',
      handle: '.handle',
      cancel: '',
      forcePlaceholderSize: true
  });

  $("#accordio").sortable("option", "items", "> ul");
  $("#accordio").disableSelection();
  $("#accordion").on("sortchange", sortEventHandler);

  $('#actionList').sortable({
      cancel: ''
  });

}]);

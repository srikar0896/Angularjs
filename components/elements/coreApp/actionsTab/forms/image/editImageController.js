var app = angular.module('plugApp');

app.controller('editImageController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService','menuService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService,menuService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';

  $scope.imageClicked == false

  $scope.all=[];
  $scope.newButtonOption = true;

  $rootScope.$on("updatePageContent", function(){
    $scope.selectedPage = fbPagesService.getSelectedPage();
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });

  $rootScope.$on("updateActionsAndCategories", function(event,obj){
    $scope.all = [];
    $scope.all = actionsAndCategoriesService.getActionsAndCategries();
  });


  $rootScope.$on("openForm", function(event,data){
    if(data.formName == 'editImageForm'){
      $scope.viewImageForm();
    }
  });

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.viewImageForm = function(){

    $('#blah2').attr('src', '');
    $scope.previewImage = '';
    $scope.showViewLoader = false;
    var actionId = actionsAndCategoriesService.getActiveActionId();
    var catId = actionsAndCategoriesService.getSelectedCategory();
    if (actionId && catId) {
        for (var i = 0; i < $scope.all.length; i++) {
            if (catId == $scope.all[i].CategoryID) {
                for (var j = 0; j < $scope.all[i].actions.length; j++) {
                    if (actionId == $scope.all[i].actions[j].ActionID) {
                      $scope.actionName = $scope.all[i].actions[j].ActionName;
                      $scope.previewImage = $scope.all[i].actions[j].plugURL;
                        if (Object.keys($scope.all[i].actions[j]).indexOf('Shortcut') >= 0) {
                            $scope.actionShortcut = $scope.all[i].actions[j].Shortcut.substr(2).trim();
                        } else {
                            $scope.actionShortcut = '';
                        }
                    }
                }
            }
        }
    }
};

  $scope.onImgLoad = function(event) {
      $scope.imageLoader = false;
  };

  $scope.updateImageAction = function() {
      $scope.showEditImageSaveLoader = true;
      AWS.config.update({
          accessKeyId: 'AKIAJMKECCPB4NIBUAXA',
          secretAccessKey: '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',
          region: 'us-east-1'
      });
      var S3 = new AWS.S3({
          params: {
              Bucket: 'plug-images'
          }
      });

      if ($scope.imageClicked == false) {
          for (var x = 0; x < $scope.all.length; x++) {
              for (var y = 0; y < $scope.all[x].actions.length; y++) {
                  if (actionsAndCategoriesService.getActiveActionId() == $scope.all[x].actions[y].ActionID) {
                      var imageItself = $scope.all[x].actions[y].plugURL;
                  }
              }
          }
      } else {
          var uri = encodeURIComponent($scope.editedImageurl);
          var imageItself = "https://s3.amazonaws.com/plug-images/" + uri;
          var file = $scope.editFile;
          if (!file) {
              $scope.showEditImageSaveLoader = false;
              alertService.addAlert("Please choose an image.", "err");
              return;
          }
          if (file.type.indexOf("image") == -1) {
              $scope.showEditImageSaveLoader = false;
              alertService.addAlert("Please choose a valid image.", "err");
              return;
          }
          var params = {
              Key: file.name,
              ContentType: file.type,
              Body: file,
              ACL: 'public-read'
          };
          S3.upload(params, function(err, data) {
              if (err) {
                  $scope.showEditImageSaveLoader = false;
                  alertService.addAlert("Image not uploaded. Please try again later.", "err");
              }
          });
      }

      var imageName = $scope.actionName;
      var imageShortcut = $scope.getShortcutForAction("//" + $scope.actionShortcut);
      var editObj = {
          "PageID": $scope.selectedPage.page_id,
          "CategoryID":actionsAndCategoriesService.getSelectedCategory(),
          "ActionID": actionsAndCategoriesService.getActiveActionId(),
          "ActionName": imageName,
          "plugURL": imageItself,
          "Shortcut":imageShortcut
      };
      if (imageName) {
          $http({
                  method: 'PUT',
                  url: plugApiService.getApi('getAllApi') + '/action',
                  data: editObj,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .success(function(response) {
                  $scope.showEditImageSaveLoader = false;
                  $scope.previewImage = '';
                  alertService.addAlert("Successfully updated " + editObj.ActionName + " action. ", "succ");

                  for (var i = 0; i < $scope.all.length; i++) {
                      for (var j = 0; j < $scope.all[i].actions.length; j++) {
                          if (actionsAndCategoriesService.getActiveActionId() == $scope.all[i].actions[j].ActionID) {
                              $scope.updateImageItemData(imageName, imageShortcut, imageItself);
                              $scope.showEditImageSaveLoader = false;
                              $scope.showImageSavedLabel = true;
                              setTimeout(function() {
                                  $scope.showImageSavedLabel = false;
                              }, 1000);
                          }
                      }
                  }
              });
      }

  };

  $scope.updateImageItemData = function(imageName, imageShortcut, imageItself) {
      for (var i = 0; i < $scope.all.length; i++) {
          for (var j = 0; j < $scope.all[i].actions.length; j++) {
              if ($scope.activeActionId == $scope.all[i].actions[j].ActionID) {
                  $scope.all[i].actions[j].ActionName = imageName;
                  $scope.all[i].actions[j].Shortcut = imageShortcut;
                  $scope.all[i].actions[j].plugURL = imageItself;
              }
          }
      }
  };

  $scope.readURL2 = function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function(e) {
              $scope.previewImage = e.target.result;
              $('#blah2').attr('src', $scope.previewImage);
              reader.readAsDataURL(input.files[0]);
              $scope.editFile = input.files[0];
              $scope.editedImageurl = input.files[0].name;
              $scope.imageClicked = true;
          }

          reader.readAsDataURL(input.files[0]);
      }
  };

  $("#editImgInp").change(function() {
      $scope.readURL2(this);
  });

}]);

var app = angular.module('plugApp');

app.controller('saveImageController',[
  '$uibModal', '$rootScope','$scope','$http','cacheService','plugApiService','fbPagesService',
  'timeService','actionsAndCategoriesService','alertService','capitalizeService','menuService',
  function($uibModal, $rootScope, $scope, $http, cacheService,
  plugApiService , fbPagesService ,timeService, actionsAndCategoriesService, alertService,
  capitalizeService,menuService){

  $scope.userData = cacheService.getLoginData();
  $scope.selectedPage = '';

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
    if(data.formName == 'saveImageForm'){
      $scope.openSaveImageForm();
    }
  });

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.openSaveImageForm = function(){
    $scope.actionName = '';
    $scope.actionShortcut = '';
    $scope.image_path = '';
  };

  $scope.readURL = function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function(e) {
              $scope.previewImageOne = e.target.result;
              $('#blah').attr('src', $scope.previewImageOne);
              $scope.denySaveImageURL = false;
              reader.readAsDataURL(input.files[0]);
              $scope.editedImageurl = input.files[0].name;
          }
          reader.readAsDataURL(input.files[0]);
      }
  };

  $("#file").change(function() {
      $("#blah").show();
      $scope.readURL(this);
  });

  $scope.getShortcutForAction = function(x) {
      if (x.length > 2) {
          return x.toLowerCase();
      } else {
          return '-1';
      }
  };

  $scope.saveImageAction = function() {
      $scope.showImageSaveLoader = true;
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

      let fileChooser = document.getElementById('file');
      let file = fileChooser.files[0];
      if (!file) {
          $scope.showImageSaveLoader = false;
          alertService.addAlert("Please choose an Image.", "err");
          return;
      }
      if (file.type.indexOf("image") == -1) {
          $scope.showImageSaveLoader = false;
          alertService.addAlert("Please choose a valid image.", "err");
          return;
      }
      var params = {
          Key: file.name,
          ContentType: file.type,
          Body: file,
          ACL: 'public-read'
      };
      $scope.fileName = params.Key;
      S3.upload(params, function(err, data) {
          if (err) {
              $scope.showImageSaveLoader = false;
              $("#chooseImage").addClas("bg-danger");
          } else {
              var imageName =$scope.actionName;
              var imageShortcut = $scope.getShortcutForAction('//'+$scope.actionShortcut);
              var uri = encodeURIComponent($scope.fileName);
              var imageItself = "https://s3.amazonaws.com/plug-images/" + uri;
              if (($scope.denySubmitDueName == false && $scope.denySubmitDueSrt  == false) && $scope.actionName.length > 0 && $scope.actionName.length <25 && ('//'+$scope.actionShortcut).length < 10 ) {
              // if(true){
                      var newAction = {
                          CategoryID: actionsAndCategoriesService.getSelectedCategory(),
                          PageID: $scope.selectedPage.page_id,
                          ActionName: capitalizeService.capitalizeFirstLetter(imageName),
                          Notes: 'null',
                          Type: "image",
                          status: 'active',
                          plugURL: imageItself,
                          Shortcut:imageShortcut
                      };
                      $http({
                              method: 'POST',
                              url: plugApiService.getApi('getAllApi') + '/action',
                              data: newAction,
                              headers: {
                                  'Content-Type': 'application/json'
                              }
                          })
                          .success(function(response) {
                              if (response.ActionID) {
                                  $scope.showImageSaveLoader = false;
                                  alertService.addAlert("Successfully created a new action","succ");
                                  for (var i = 0; i < $scope.all.length; i++) {
                                      if (newAction.CategoryID == $scope.all[i].CategoryID) {
                                          $scope.imageName = '';
                                          $scope.imageShortcut = '';
                                          $scope.all[i].actions.push(newAction);
                                          for (i = 0; i < $scope.all.length; i++) {
                                              for (j = 0; j < $scope.all[i].actions.length; j++) {
                                                  if (newAction.ActionName == $scope.all[i].actions[j].ActionName) {
                                                      $scope.all[i].actions[j]['ActionID'] = response.ActionID;
                                                      actionsAndCategoriesService.setActionsAndCategries($scope.all);
                                                      $rootScope.$broadcast('updateActionsAndCategories');
                                                      var data = {};
                                                      data["actId"] = response.ActionID;
                                                      data["catId"] = newAction.CategoryID;
                                                      $rootScope.$broadcast('viewAction',data);

                                                  }
                                              }
                                          }
                                      }
                                  }
                              } else {
                                  $scope.showImageSaveLoader = false;
                              }
                          });

              }
          }
      });
  };

}]);

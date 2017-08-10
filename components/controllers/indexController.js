var app = angular.module('plugApp');
app.controller('indexController',['$uibModal', '$scope',function($uibModal, $scope){
  $scope.options = {
    theme: {
        logo: 'assets/image-resources/logo.png'
      },
    languageDictionary: {
        title: ""
      },
    responseType: 'token id_token',
    connections:['facebook'],
    loginAfterSignUp:false,
    auth: {
         responseType: 'token',
         redirectUrl: 'http://localhost/monarch/app.html#/login'
   }
  };

    $scope.lock = new Auth0Lock('XABSNrV7kCHkAeeM70YY5MHnaUPfv2gk','ksg207.auth0.com',$scope.options);

    $scope.showLoginModal = function(){
        $scope.lock.show($scope.options);
      };

    var signupmodal = function(){
    return $scope.modalInstance = $uibModal.open({
        templateUrl: 'modals/signupModal',
        scope: $scope
      });
    };

    $scope.openSignupModal = function(){
      signupmodal().result
        .then(function(){
               console.log("result function");
             });
    };

    $scope.ok = function(){
      $scope.modalInstance.close('Yes Button Clicked');
    };

    $scope.cancel = function(){
      $scope.modalInstance.dismiss('No Button Clicked');
    };
}]);

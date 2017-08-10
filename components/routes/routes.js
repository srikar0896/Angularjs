var app = angular.module('plugApp');

app.config(function($stateProvider,$urlRouterProvider) {

  $stateProvider.state("appHome", {
    url: '',
    templateUrl: 'pages/index.html',
    css:['assets/frontend-elements/testimonial-box.css','assets/widgets/modal/modal.css']
    });

  $stateProvider.state("logout", {
    url: '/',
    templateUrl: 'pages/index.html',
    css:['assets/frontend-elements/testimonial-box.css','assets/widgets/modal/modal.css']
    });

  $stateProvider.state("login", {
    url: '/login',
    templateUrl: 'app.html'
    });

  $stateProvider.state("signup", {
    url: '/signup',
    templateUrl: 'pages/signup.html'
    });

  $stateProvider.state("signupPrompt", {
    url: '/signupPrompt',
    templateUrl: 'pages/index.html',
    controller: function($uibModal,$scope){
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

    $scope.openSignupModal();
    }
  });

  $stateProvider.state("appPage", {
    url: '/app',
    templateUrl: 'pages/try.html'
    });

  // $urlRouterProvider.otherwise('/404');

  $stateProvider.state("otherwise", {
    url: '/404',
    templateUrl: 'pages/errorPage.html'
    });

});

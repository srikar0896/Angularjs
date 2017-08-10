var app = angular.module("plugApp");
app.directive("signupPage", function() {
    return {
        restrict: 'E',
        templateUrl : 'pages/signup.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

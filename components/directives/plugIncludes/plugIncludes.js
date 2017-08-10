var app = angular.module("plugApp");
app.directive("plugIncludes", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/plugIncludes/plugIncludes.html',
        css: 'assets/frontend-elements/cta-box.css'
    };
});

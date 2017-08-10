var app = angular.module("plugApp");
app.directive("actionsTab", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("actionPalette", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/actionPalette.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("actionForms", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

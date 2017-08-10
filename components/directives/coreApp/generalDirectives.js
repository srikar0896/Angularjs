var app = angular.module("plugApp");
app.directive("topNavigation", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/navBar.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("fbpageselectionModal", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/fbpageSelectionModal.html',
        css: 'assets/widgets/chosen/chosen.css'
    };
});

app.directive("learnTab", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/learnTab/learnTab.html',
        css: 'assets/widgets/chosen/chosen.css'
    };
});

app.directive("alertBar", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/widgets/alertBar.html'
      };
});

app.directive('chosen', function($timeout) {

    var linker = function(scope, element, attr) {

        scope.$watch('all', function() {
            $timeout(function() {
                $(element).trigger('chosen:updated');
            }, 0, false);
        }, true);
        $timeout(function() {
            $(element).chosen();
        }, 0, false);

        $(function() {
            $(element).chosen();

        });
    };
    return {
        restrict: 'A',
        link: linker
    };
});

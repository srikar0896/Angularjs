var app = angular.module("plugApp");
app.directive("chatTab", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/chatTab.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("plugTimeline", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/chatTab/timeline.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("chatBox", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/chatTab/chatbox.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("chatActions", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/chatTab/chatActions.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

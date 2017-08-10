var app = angular.module("plugApp");
app.directive("typeselectorForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/typeSelectorForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("savetextForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/text/saveTextForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("edittextForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/text/editTextForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("editformSidebar", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/editFormsideBar.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("saveformInputs", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/saveFormInputs.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("editformInputs", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/editFormInputs.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("savesuperactionForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/superAction/saveSuperActionForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("editsuperactionForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/superAction/editSuperActionForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("saveimageForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/image/saveImageForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("editimageForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/image/editImageForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("savemenuForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/menu/saveMenuForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("editmenuForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/menu/editMenuForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("getstartedbuttonForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/messengerProfile/getStartedButtonForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("greetingtextForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/messengerProfile/greetingTextForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("persistentmenuForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/messengerProfile/persistentMenuForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("actiondeleteModal", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/actionDeleteModal.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("menubuttondeleteModal", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/menuButtonDeletionModal.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("menubuttonForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/menuButtonForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("usageForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/usageForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive("notesForm", function() {
    return {
        restrict: 'E',
        templateUrl : 'components/elements/coreApp/actionsTab/forms/notesForm.html'
        // css: 'assets/frontend-elements/cta-box.css'
    };
});

app.directive('usageWidget', [function() {
    return {
        restrict: 'E',
        templateUrl: 'components/widgets/usageWidget.html'
    };
}]);

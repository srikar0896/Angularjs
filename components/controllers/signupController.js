var app = angular.module('plugApp');

app.controller('signupController',['$scope','$http','plugApiService', function($scope,$http,plugApiService){

$scope.requestStatus = 'notSent';
$scope.pageName = '';
$scope.username = '';
$scope.email = '';

$scope.signup = function(){
  console.log("signing up");
        var dataObj = {};
        dataObj["name"] = $scope.username;
        dataObj["email"] = $scope.email;
        var len = $scope.pageName.length;
        if(len>0)
        {
          dataObj["page_name"] =  $scope.pageName;
        }
          else {
            dataObj["page_name"] = "NULL";
          }

        $http({
            method: 'POST',
             url: plugApiService.getApi('signupApi') ,
            data: dataObj,
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(function(response) {
                    console.log(response);
                    $scope.requestStatus = 'sent';
            });
};
}]);

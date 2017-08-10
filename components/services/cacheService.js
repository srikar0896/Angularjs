var app = angular.module('plugApp');
app.service("cacheService", function(){
  var pagesData = {};
  var loginData = {};
  var data = {};

  return {

   getpageData : function () {
     return pagesData;
   },

   setPageName : function (name) {
     pagesData.pageName = name;
   },

   setUserPicture : function (url) {
     loginData.userDP = url;
     sessionStorage.saveUserDP = url;

   },

   setPageId : function (id) {
     pagesData.pageId = id;
   },

   setUserName : function (name) {
     loginData.userName = name;
     sessionStorage.saveUsername = name;
   },

   setUserEmail : function (mail) {
     loginData.userEmail = mail;
     sessionStorage.saveUserEmail = mail;
   },

   getLoginData : function () {
     var sessionUsername = sessionStorage.getItem('saveUsername');
     var sessionEmail = sessionStorage.getItem('saveUserEmail');
     var sessionUserDP = sessionStorage.getItem('saveUserDP');
     if(typeof sessionEmail!== null && typeof sessionUsername!== null){
       loginData.userEmail = sessionEmail;
       loginData.userName = sessionUsername;
       loginData.userDP = sessionUserDP;
        }
      return loginData;
    },


    removeUserData : function(){
      sessionStorage.removeItem('saveUsername');
      sessionStorage.removeItem('saveUserEmail');
      sessionStorage.removeItem('saveUserDP');
    }
  }
});

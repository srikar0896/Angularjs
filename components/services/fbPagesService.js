var app = angular.module('plugApp');
app.factory("fbPagesService", function(){
  var pagesData = {};
  var selectedPageId = '';
  var selectedPage = {};

  return {

   getPages : function () {
     return pagesData;
   },

   setSelectedPage : function (x) {
     selectedPageId = x;
   },

   getSelectedPage : function () {
     for(var i=0;i<pagesData.pages.length;i++){
       if(pagesData.pages[i].page_id == selectedPageId){
          selectedPage = pagesData.pages[i];
       }
     }
     return selectedPage;
   },

   setPages : function (pages) {
     pagesData.pages = pages;

   },
  }
});

var app = angular.module('plugApp');
app.service("timeService", function(){
  return {
   getTime : function (xx) {
     var t = Date.now();
     var millisec = t - xx;
     var seconds = (millisec / 1000).toFixed(1);
     var minutes = (millisec / (1000 * 60)).toFixed(1);
     var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
     var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
     var months = (millisec / (1000 * 60 * 60 * 24 * 30)).toFixed(1);
     if (seconds < 60) {
         return "few seconds ago";
     } else if (minutes < 60) {
         return parseInt(minutes) + " minutes ago";
     } else if (hours < 24) {
         return parseInt(hours) + " hours ago";
     } else {
         if (hours > 24 && hours < 48) {
             return parseInt(days) + " day ago"
         }
         if (hours > 48) {
           if(days <30){
             return parseInt(days) + " days ago";
           }else{
             if(months>1){
               return parseInt(months) + " months ago";
             }else{
               return parseInt(months) + " month ago";
             }

           }
         }
     }
   }
 }
});

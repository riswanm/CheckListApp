angular.module('starter.services', [])
  .service('checklistService', function checklistService($http ) {
      var USER_CHECK_LIST_CACHE = 'USER_CHECK_LIST_CACHE';
      this.getCheckList = function () {
          return $http.get('data/checklist.json');
      };
      
      this.getUserCheckedList = function(date){
         var userCheckListCache = localStorage[USER_CHECK_LIST_CACHE];
         if (userCheckListCache){
          return JSON.parse(userCheckListCache)[date];
         }
         return 'null';
      }
      
      this.saveUserCheckedList = function(date, checkedIDs){
        var checkListTobeStored = {};
        if(localStorage[USER_CHECK_LIST_CACHE]){
           checkListTobeStored = JSON.parse(localStorage[USER_CHECK_LIST_CACHE]);
        }
        checkListTobeStored[date] = checkedIDs
        localStorage[USER_CHECK_LIST_CACHE] = JSON.stringify( checkListTobeStored);
      }

  });
  
  
  
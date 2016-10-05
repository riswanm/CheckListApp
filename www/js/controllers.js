angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,$filter,checklistService,  $ionicPopover) {
  
    $scope.model = {};
    $scope.model.selectedDate = new Date();
   
    
    
     $ionicPopover.fromTemplateUrl('dateSelectPopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
    
  });
  
   $scope.openDateSelection = function($event) {
   $scope.model.dateTobeSelected = $scope.model.selectedDate ;
    $scope.popover.show($event);
  };
  
  function getCheckedList(selectedDate){
      if (selectedDate){
    checklistService.getCheckList()
        .success(function (data) {
           var userCheckedList = checklistService.getUserCheckedList(getDateKey(selectedDate));
          // $scope.playlists  = data;
          $scope.totalTasks =  data.length; 
          
          if (userCheckedList && userCheckedList.length>0){
             var userCheckedListIds = userCheckedList.split(',');
             data.forEach(function(element) {
              if( userCheckedListIds.indexOf( element.id.toString()) >= 0){
                element.checked = true;
              }
              else{
                element.checked = false;
              }
             }, this);
            // The json data will now be in scope.
          $scope.playlists  = data;
          }
          else{
            $scope.playlists  = data;
          }
        }).error(function (err) {
            alert('Error occured while getting check list');
        });
      }
    }
    

      $scope.getDateText = function(){
          if (getDateKey($scope.model.selectedDate) == getDateKey(new Date()) ){
              return 'Today';
          }
          else if(getDateKey($scope.model.selectedDate) == getDateKey(new Date().setDate(new Date().getDate() - 1)) ){
               return 'Yesterday';
          }
          else{
             return $filter('date')($scope.model.selectedDate, 'yyyy MMM dd');
          }
      }
      $scope.changeDate = function(){
            
            $scope.popover.hide();
            $scope.model.selectedDate = $scope.model.dateTobeSelected;
            getCheckedList($scope.model.selectedDate);
       }
    
      getCheckedList($scope.model.selectedDate);
        

    $scope.$watch('playlists', function() {
 

 if ($scope.playlists){
   
     var completedTasks = 0, checkedIDs = '';
   $scope.playlists.forEach(function(element) {
     if (element.checked){
        completedTasks++;;
        checkedIDs = checkedIDs + element.id.toString() + ',';
     }
     
      $scope.completedTasks = completedTasks;
   }, this);
   
   var dateKey = getDateKey($scope.model.selectedDate);
   
   if (checkedIDs.length>0){
    checkedIDs=  checkedIDs.substr(0,checkedIDs.length-1);
   }
   checklistService.saveUserCheckedList(dateKey,checkedIDs);
 }
   
   
   
  }, true);
  
   $scope.taskCompleteStyle = function(){
       var completePercentage = ($scope.completedTasks/$scope.totalTasks)*100;
       
       if (completePercentage < 25){
           return 'bar-assertive';
       }
       else if (completePercentage < 50){
            return 'bar-energized';
       }
       else if (completePercentage < 80){
            return 'bar-positive';
       }
       else if (completePercentage > 80){
            return 'bar-balanced';
       }
       return 'bar-assertive';
    }
  

  function getDateKey(date){
    return $filter('date')(date, 'yyyyMMdd');
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

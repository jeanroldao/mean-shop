var app = angular.module('myApp', ['ng']);

app.directive('counterDirective', function() {
  return {
    controller: 'MyController',
    template: '<div ng-controller="MyController" '
            + '     ng-click="counter = counter + 1">'
            + 'You\'ve clicked this div {{counter}} times'
            + '</div>'
  };
});

app.controller('MyController', function($scope) {
  $scope.counter = 0;
});

app.directive('userMenu', function() {
  return {
    controller: 'MyHttpController',
    template: '<div class="user" ng-show="user">'
            + '  Current User: {{user.profile.username}}'
            + '</div>'
            + '<div ng-show="!user">'
            + '  <a href="/auth/facebook">'
            + '    Log In'
            + '  </a>'
            + '</div>'
  };
});

app.controller('MyHttpController', function($scope, $http) {
  $http.get('/api/v1/me').success(function(data) {
    $scope.user = data.user;
    
    $scope.menus = [{ text: 'Home' }, { text: 'Myself' }, { text: 'About Us' }];
  });
});





describe('counterDirective', function() {
  var injector;
  var element;
  var scope;
  
  beforeEach(function() {
    injector = angular.injector(['myApp']);
    
    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<counter-directive></counter-directive>')(scope);
      scope.$apply();
    });
  });
  
  it('increments the counter when you click', function() {
    assert.equal(element.text(), 'You\'ve clicked this div 0 times');
    element.find('div').click();
    assert.equal(element.text(), 'You\'ve clicked this div 1 times');
  });
});

describe('Nav Bar', function() {
  var injector;
  var element;
  var scope;
  var compiler;
  var httpBackend;
  
  beforeEach(function() {
    injector = angular.injector(['myApp', 'ngMockE2E']);
    //intercepts = {};
    
    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();
      compiler = $compile;
      httpBackend = $httpBackend;
    });
  });
  
  it('shows logged in user name', function(done) {
    httpBackend.expectGET('/api/v1/me').respond({
      user: { profile: { username: 'John' } }
    });
    
    element = compiler('<user-menu></user-menu>')(scope);
    scope.$apply();
    
    httpBackend.flush();
    
    assert.notEqual(element.find('.user').css('display'), 'none');
    assert.equal(element.find('.user').text().trim(), 'Current User: John');
    done();
  });
});










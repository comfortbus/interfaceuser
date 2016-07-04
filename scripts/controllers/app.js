'use strict';

var appM = angular.module('eva', [
    'ngRoute'
])

appM.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    // Carregamento das views.
    $routeProvider.
        when('/', {
            templateUrl: 'view/home.html',
            controller: 'index' 
        }).
        when('/grupos', {
            templateUrl: 'view/grupos/list.html',
            controller: 'Grupos'
        }).
        otherwise({
            redirectTo: '/'
    });
    // ferificando se o usuário esta logado no sistema 
  }
    
]);

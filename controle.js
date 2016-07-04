var myApp = angular.module('eva',['ngRoute','uiGmapgoogle-maps']);

myApp.config(['$routeProvider', '$httpProvider','uiGmapGoogleMapApiProvider', function ($routeProvider, $httpProvider,GoogleMapApiProviders) {
    GoogleMapApiProviders.configure({
            china: true
        });
    // Carregamento das views.
    $routeProvider.
        when('/', {
            templateUrl: 'view/home.html',
            controller: 'index' 
        }).
        when('/previsao', {
            templateUrl: 'view/previsao.html',
            controller: 'previsao'
        }).
        otherwise({
            redirectTo: '/',
            controller: 'index'
    });
    // ferificando se o usuário esta logado no sistema 
  }
    
]);

myApp.controller('index', ['$scope',"$http","$window", function($scope,$http,$window) {
  
  $scope.parada = [];
  $scope.estimativas = [];
  $scope.listaVehicles = [];
  $scope.paradaorg = [];
  $scope.paradadst = [];

  var geolocation =$window.navigator.geolocation;
  geolocation.getCurrentPosition(sucesso1, erro1);

  function sucesso1(posicao){
    console.log(posicao)
    var lat = posicao.coords.latitude;
    var lon = posicao.coords.longitude;
    window.sessionStorage.setItem('lat', lat);
    window.sessionStorage.setItem('lon', lon);
    console.log("Lat: "+lat+" Long: "+lon);
             
  }

  function erro1(error){
    //$.toast('Erro ao identificar coordenadas atual!', {sticky: true, type: 'danger'});
    console.log("Erro loc.")
  }

  $scope.previsao = function(){
    window.location = "#/previsao"
  }

  $scope.ela = function(){
    window.location = "#/ela"

    if ($window.navigator && $window.navigator.geolocation) {
      var geolocation =$window.navigator.geolocation;
      geolocation.getCurrentPosition(sucesso, erro);
    }
    //console.log(geolocation)
    function sucesso(posicao){
      console.log(posicao)
      var lat = posicao.coords.latitude;
      var lon = posicao.coords.longitude;
      console.log("Lat: "+lat+" Long: "+lon);
      listarParadas(lat,lon);             
    }
    function erro(error){
      //$.toast('Erro ao identificar coordenadas atual!', {sticky: true, type: 'danger'});
      alert("Erro loc.")
    }
  }

  function listarParadas(lat,lon){
    console.log("http://200.238.105.143:85/public/recife/stops?lat=-8.0608147&lon=-34.8853961&meters=100");
    $http({
      method: 'GET',
      url:"https://cors-anywhere.herokuapp.com/http://200.238.105.143:85/public/recife/stops?lat=-8.0633176&lon=-34.8806253&meters=300",
      headers: {
        'Content-Type': 'application/json'
      }
      }).then(function successCallback(response) {
            var listaParadas = response.data;
            console.log(listaParadas)
            listarestimativas(listaParadas,lat,lon)

        }, 
    function errorCallback(response) {
      //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
    });
  }

  function listarestimativas(list,lat,lon){
    var tam = list.length;
      for (var i = 0; list.length > i; i++) {
        var idparada = list[i];

      console.log("http://200.238.105.143:85/public/recife/stop/"+idparada+"/estimations");
      $http({
        method: 'GET',
        url:"https://cors-anywhere.herokuapp.com/http://200.238.105.143:85/public/recife/stop/"+idparada+"/estimations",
        headers: {
          'Content-Type': 'application/json'
        }
        }).then(function successCallback(response) {
              var estimativas = response.data;
              var listEst = [];
              for (var i = 0; estimativas.length > i; i++) {
                //$scope.parada.push(listaParadas[i]);
                var obj = {
                  "line":estimativas[i].line,
                  "veiculo":estimativas[i].vehicle
                }
                listEst.push(obj);
              };
               $scope.estimativas.push(listEst)
              console.log($scope.estimativas.length)
              console.log($scope.estimativas)
              if($scope.estimativas.length == tam){
                listarVeiculos($scope.estimativas)
              }
              //console.log($scope.estimativas);
          },
      function errorCallback(response) {
        //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
      });
        //mostrarLista($scope.estimativas)
    }
  }
}]);

myApp.controller('previsao', ['$scope',"$http","$window", function($scope,$http,$window) {

  var lat = window.sessionStorage.getItem('lat')
  var lon = window.sessionStorage.getItem('lon')
  $scope.map = { center: { latitude: lat, longitude: lon }, zoom: 14, id:'1' };

    $scope.enviar = function(){
      if ($window.navigator && $window.navigator.geolocation) {
        var geolocation =$window.navigator.geolocation;
        geolocation.getCurrentPosition(sucesso, erro);
      }
      //console.log(geolocation)
      function sucesso(posicao){
        console.log(posicao)
        var lat = posicao.coords.latitude;
        var lon = posicao.coords.longitude;
        console.log("Lat: "+lat+" Long: "+lon);
        listarParadas(lat,lon);             
      }
      function erro(error){
        //$.toast('Erro ao identificar coordenadas atual!', {sticky: true, type: 'danger'});
        alert("Erro loc.")
      }
    }

    function listarveiculosParadaORG(){
      console.log("http://200.238.105.143:85/public/recife/stop/PA19423/estimations");
      $http({
        method: 'GET',
        url:"https://cors-anywhere.herokuapp.com/http://200.238.105.143:85/public/recife/stop/PA19423/estimations",
        headers: {
          'Content-Type': 'application/json'
        }
        }).then(function successCallback(response){
          var listaveiculosORG = response.data;
          var listvehiORG = [];
          for (var j = 0; listaveiculosORG.length > j; j++) {
            var obj = {
               "tempodeestimativa":listaveiculosORG[j].arrivalTime,
               "veiculo":listaveiculosORG[j].vehicle
            }
            console.log(obj);
            listvehiORG.push(obj);
          };
          listarveiculosParadaDST(listvehiORG);
        },
      function errorCallback(response) {
        //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
      });
    }

    function listarveiculosParadaDST(listvehiORG){
      console.log("http://200.238.105.143:85/public/recife/stop/PA80011I/estimations");
      $http({
        method: 'GET',
        url:"https://cors-anywhere.herokuapp.com/http://200.238.105.143:85/public/recife/stop/PA80011I/estimations",
        headers: {
          'Content-Type': 'application/json'
        }
        }).then(function successCallback(response){
          var listaveiculosDST = response.data;
          var listvehiDST = [];
          for (var j = 0; listaveiculosORG.length > j; j++) {
            var obj = {
             "tempodeestimativa":listaveiculosDST[j].arrivalTime,
             "veiculo":listaveiculosDST[j].vehicle
            }
            console.log(obj);
            listvehiDST.push(obj);
          };
          listarVeiculos(listvehiDST,listvehiORG);
        },
        function errorCallback(response){
          //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
        });
    }

    function listarVeiculos(listvehiDST,listvehiORG){
      var listvehi = [];
      for(var k = 0; listvehiDST.length > k ; k++){
        for (var i = 0; listvehiORG.length > i ; i++){
          if (listvehiDST[k].veiculo == listvehiORG[i].veiculo){
            var obj = {
               "veiculo":listvehiORG[i].veiculo,
               "tempodeestimativa":listvehiORG[i].tempodeestimativa,
            }
            console.log(obj);
            listvehi.push(obj);
            //$scope.parada.push(listaParadas[i]);
          }
        }
      }
    };

    function listarLinhasParadaEscolhida(){
      var cond = "true";
     //console.log(lista)
          console.log("http://200.238.105.143:85/public/recife/stop/"+$scope.parada+"/estimations");
          $http({
            method: 'GET',
            url:"https://cors-anywhere.herokuapp.com/http://200.238.105.143:85/public/recife/stop/"+$scope.parada+"/estimations",
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function successCallback(response) {
              var listaParadasEscolhidas = response.data;
              console.log(listaParadasEscolhidas);
              for( var y = 0; lista.length > y ; y ++){
                if(cond == "true"){
                for (var j = 0; listaParadasEscolhidas.stops.length > j; j++) {
                  console.log(listaParadasEscolhidas.stops[j].label + "??" + lista[y])
                    if (listaParadasEscolhidas.stops[j].label == lista[y]){
                        var obj = {
                            "lat" : listaParadasEscolhidas.stops[j].location.lat,
                            "lon" : listaParadasEscolhidas.stops[j].location.lon
                        }
                        console.log(obj)
                        cond = "false"
                        enviabanco(obj);

                        break;
                      }
                    }
                  }else{
                    break;
                  }
                };
              }, 
          function errorCallback(response) {
            //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
          });
        }

        function enviabanco (obj){
          var date = new Date();
          console.log("http://10.0.20.191:9000/save/"+$scope.onibus+"/"+$scope.linha+"/"+obj.lat+"/"+obj.lon+"/ELA"+"/"+date);
          $http({
            method: 'GET',
            url:"http://10.0.20.191:9000/save/"+$scope.onibus+"/"+$scope.linha+"/"+obj.lat+"/"+obj.lon+"/ELA"+"/"+date+"/"+$scope.descricao,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function successCallback(response) {
            console.log(response)
            alert("Enviada com sucesso!")
            window.location="#/index"
                    
          }, 
          function errorCallback(response) {
            //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
          });

        }

}]);

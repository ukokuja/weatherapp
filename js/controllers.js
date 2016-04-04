/**
 * Created by lucas on 07/03/16.
 */
var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/';
var apiKey = '185299c8d9febb9684dd12aade1d3e83';

var app = angular.module('WeatherApp', [])
    .controller('HeaderCtrl', function($scope, geoService, $http) {
        $scope.headerStyle = {'background-image': 'url("img/weathers/fa-cloud.jpg")'};
        $scope.localData = {};
        geoService.getCurrentPosition().then(getCurrentInformation);

        function getCurrentInformation(a){
            geoService.getInformation(a.coords.latitude, a.coords.longitude,
                function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.$apply(function () {
                                $scope.localData = angular.extend($scope.localData, results[1]);
                            });
                        }
                    }
                });
            $http.get(openWeatherUrl+'weather?lat='+a.coords.latitude+'&lon='+a.coords.longitude+'&appid='+apiKey).then(
                function successCallback(response) {
                    $scope.localData = angular.extend($scope.localData, {weather: response.data.weather[0]})
                    $scope.headerStyle = {'background-image': 'url("img/weathers/'+$scope.icon($scope.localData.weather.id)+'.jpg")'};;
                }, function errorCallback(response) {
                });
        }
    })
    .controller('MainCtrl', function($scope, $http){
        $scope.init = function(){
            $scope.places = [];
            $scope.finish = false;
            var a = [0,10];
            var j = 0;
            while((a[0] + a[1])<=190){
                var b = [0,10];
                while((b[0] + b[1])<=190){
                    $http.get(openWeatherUrl+'box/city?bbox='+ a[0]+','+b[0]+','+a[1]+','+b[1]+'&appid='+apiKey).then(
                        function successCallback(response) {
                            _.each(response.data.list, function(val){
                                var obj = {
                                    name: val.name,
                                    temp :val.main.temp,
                                    humidity: val.main.humidity,
                                    weather: val.weather[0],
                                    rank: Math.abs($scope.temp - val.main.temp) + Math.abs($scope.humidity - val.main.humidity)
                                };
                                $scope.places.push(obj);
                            });
                            j++;
                            if(j==100){
                                $scope.places = _.sortBy($scope.places,
                                    function(place){ return place.rank; }
                                );
                                $scope.finish = true;
                            }
                        }, function errorCallback() {
                            j++;
                            if(j==100){
                                $scope.places = _.sortBy($scope.places,
                                    function(place){ return place.rank; }
                                );
                                $scope.finish = true;
                            }
                        });
                    b[0]+=10;
                    b[1]+=10;
                }
                a[0]+=10;
                a[1]+=10;
            }
        }
        $scope.init();
        $scope.moreDetails = function(place){
            swal({
                title: place.name,
                text: '<img src="http://openweathermap.org/img/w/'+place.weather.icon+'.png"> - <span>'+place.weather.description+'</span>' +
                '<br><span>'+place.temp+'°C'+' - '+place.humidity+'%</span>',
                html: true });
        };
    }).controller('GeneralCtrl', function($scope) {
        $scope.male = true;
        $scope.temp= 21;
        $scope.humidity = 50;
        $scope.icon = function(id){
            if(_.inRange(id, 0, 232)){
                return 'fa-bolt';
            }else if(_.inRange(id, 299, 531)){
                return 'fa-tint';
            }else if(_.inRange(id, 599, 640)){
                return 'fa-asterisk';
            }else if(_.inRange(id, 700, 781) || _.inRange(id, 801, 1000)){
                return 'fa-cloud';
            }else if(id == 800){
                return 'fa-sun-o';
            }else{
                return 'fa-sun-o';
            }
        };
    });
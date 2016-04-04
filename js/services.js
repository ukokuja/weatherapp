/**
 * Created by lucas on 07/03/16.
 */
app.factory('geoService', ['$q', '$window', function ($q, $window) {

    'use strict';
    var geocoder = new google.maps.Geocoder();
    function getCurrentPosition() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
            deferred.reject('Geolocation not supported.');
        } else {
            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    deferred.resolve(position);
                },
                function (err) {
                    deferred.reject(err);
                });
        }

        return deferred.promise;
    }
    function getInformation(lat, lng, func){
        var latlng = new google.maps.LatLng(lat, lng);
        return geocoder.geocode({
            'latLng': latlng
        }, func);

    }

    return {
        getCurrentPosition: getCurrentPosition,
        getInformation: getInformation
    };
}]);
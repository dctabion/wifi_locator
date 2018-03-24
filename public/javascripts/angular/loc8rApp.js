angular.module('loc8rApp', []);

var loc8rData = function ($http) {
  return $http.get('/api/locations?lat=41.9225028&lng=-87.7035451&maxDistance=10799');
};
//
// lat: 41.9225028,
//       lng: -87.7035451,
//       maxDistance: 10799

var locationListCtrl = function ($scope, loc8rData) {
  loc8rData
    .success(function (data) {
      console.log('in success after $http to get locations list');
      $scope.data = { locations: data };
    })
    .error(function (e) {
      console.log('error: ',e);
    });

  // $scope.data = { locations: loc8rData };
};

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function() {
  return function (distance) {
    var numDistance, unit;
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    }
    else {
      numDistance = parseInt(distance * 1000,10);
      unit = 'm';
    }
    return numDistance + unit;
  };
};

var ratingStars = function(){
  return {
    scope: {
      thisRating: '=rating'
    },
    templateUrl: '/javascripts/angular/rating-stars.html'
  };
};

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData);

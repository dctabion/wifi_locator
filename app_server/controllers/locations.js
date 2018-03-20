var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://sheltered-peak-20716.herokuapp.com/";
}

var renderHomepage = function(req, res, responseBody) {
  console.log('---renderHomepage()');
  var message;
  if (!(responseBody instanceof Array)) {
    console.log('responseBody not instance of array: ', responseBody);
    message = "API lookup error (responseBody not instance of array)";
    responseBody = [];
  }
  else if (!responseBody.length) {
    message = "No places found nearby";
  }
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with WIFI',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody,
    message: message
   });
}

/* GET 'home' page */
module.exports.homelist = function (req, res) {
  console.log('---homelist()');
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: -87.7035451,
      lat: 41.9225028,
      maxDistance: 10721
      // lng: 50,
      // lat: 100,
      // maxDistance: 1
      // lng: 0,
      // lat: 0,
      // maxDistance: 1
      // 0 Starcups, 79.57072 Jow Blow's, 10720.126 Jim Crow
    }
  };
  console.log('requestOptions')
  request(
    requestOptions,
    function(err, response, body) {
      console.log('---RESPONSE---');
      console.log('err', err);
      // console.log('response: ', response);
      console.log('body', body);

      var i, data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        for (i=0; i<data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);  // --- maybe don't need this helper
  });
};

var _formatDistance = function(distance) {
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

/* GET 'Location info' page */
module.exports.locationInfo = function (req, res) {
  res.render('location-info', {
    title: 'Location Info',
    pageHeader: {title: 'Starcups'},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been ad you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium WIFI'],
      coords: {lat: 51.455041, lng: -0.9690884},
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      },{
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      },{
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: 5,
        timestamp: '16 July 2013',
        reviewText: 'What a great place.  I can\'t say enough good things about it.'
      }, {
        author: 'Dood McGee',
        rating: 5,
        timestamp: '17 July 2013',
        reviewText: 'A class a dump.  I cannot stand it.  loud. obnoxious.  But i\'ll give 5 stars.'
      }, {
        author: 'Fred McGriff',
        rating: 5,
        timestamp: '1 July 2013',
        reviewText: 'Well, what can i say?  Dood McGee goes here.  Everyone wants to be like Dood.'
      }]
    }
  });
};


/* GET 'Add review' page */
module.exports.addReview = function (req, res) {
  console.log('---addReview()');
  res.render('location-review-form', { title: 'Add review'});
};

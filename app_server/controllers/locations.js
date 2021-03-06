var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://sheltered-peak-20716.herokuapp.com/";
}

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

// var _isNumeric = function (n) {
//   return !isNaN(parseFloat(n)) && isFinite(n);
// };
//
// var _formatDistance = function (distance) {
//   var numDistance, unit;
//   if (distance && _isNumeric(distance)) {
//     if (distance > 1) {
//       numDistance = parseFloat(distance).toFixed(1);
//       unit = 'km';
//     } else {
//       numDistance = parseInt(distance * 1000,10);
//       unit = 'm';
//     }
//     return numDistance + unit;
//   } else {
//     return "?";
//   }
// };

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh, dear. Looks like we can't find the page. Sorry.";
  }
  else {
    title = status + ", something's gone wrong.";
    content = "Something, somewhere has gone a little bit off";
  }
  res.status(status);
  res.render('generic-text', {
    title: title,
    content: content
  });
};

var getLocationInfo = function (req, res, callback) {
  var requestOptions, path;
  console.log('getLocationInfo()------');
  console.log('req.params: ', req.params);
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      console.log('body: ', body);
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        console.log("data-----", data);
        callback(req, res, data);  // take appropriate action
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

var renderHomepage = function(req, res) {
  console.log('---renderHomepage()');

  res.render('locations-list', {
    title: 'Loc8r - find a place to work with WIFI',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
   });
}

function renderDetailPage(req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been ad you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};

function renderReviewForm(req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review ' + locDetail.name },
    error: req.query.err
  });
}

/* GET 'home' page */
module.exports.homelist = function (req, res) {
  console.log('---homelist()');
  renderHomepage(req, res);  // --- maybe don't need this helper
};




/* GET 'Location info' page */
module.exports.locationInfo = function (req, res) {
  getLocationInfo(req, res, function (req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });
};


/* GET 'Add review' page */
module.exports.addReview = function (req, res) {
  console.log('---addReview()');
  getLocationInfo(req, res, function(req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

/* POST 'Add review' page */
module.exports.doAddReview = function (req, res) {
  console.log('---doAddReview()');
  var requestOptions, path, locationid, postData;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + "/reviews"
  postData = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postData
  };
  // if (postData.author == "dood") { // this will allow the api to catch validation error except for 'dood'
  if (!postData.author || !postData.rating || !postData.reviewText) {
    console.log('---caught review validation error in app controller doAddReview().  missing field');
    console.log('requestOptions:', requestOptions);
    res.redirect('/location/' + locationid + '/reviews/new?err=val');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/location/' + locationid);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          console.log('----caught review validation error.  API caught it and gave app controller doAddReview() a 400');
          res.redirect('/location/' + locationid + '/reviews/new?err=val');
        } else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

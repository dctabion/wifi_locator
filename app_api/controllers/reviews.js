var mongoose = require('mongoose');
var Loc = mongoose.model('Location')

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var doAddReview = function(req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, {
      "message": "locationid not found"
    });
  }
  else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
  }

  location.save(function(err, location) {
    var thisReview;
    if (err) {
      sendJsonResponse(res, 400, err)
    }
    else {
      updateAverageRating(location._id);
      thisReview = location.reviews[location.reviews.length - 1];
      sendJsonResponse(res, 201, thisReview);
    }
  });
}

var updateAverageRating = function(locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
      function(err, location) {
        if (!err) {
          doSetAverageRating(location);
        }
      });
};

var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewcount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};



module.exports.reviewsCreate = function(req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function (err, location) {
          if (err) {
            sendJsonResponse(res, 400, err);
          }
          else {
            doAddReview(req, res, location);
          }
        }
      );
  }
  else {
    sendJsonResponse(res, 404, { "messages": "Not found, locationid required"});
  }

};


module.exports.reviewsReadOne = function(req, res) {
  console.log("reviewsReadOne: ", req.params);

  // if there are params and a locationid in the params & a reviewid in the paras
  if(req.params && req.params.locationid && req.params.reviewid) {
    // find the location document
    Loc.findById(req.params.locationid).select('name reviews').exec(function(err, location){
      var response, review;

      // Location ID not found
      if(!location) {
        sendJsonResponse(res, 404, { messages: "locationid not found"});
        return;
      }
      // DB error
      else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }

      // Location document has review attribute & a review exists
      if (location.reviews && location.reviews.length > 0) {
        review = location.reviews.id(req.params.reviewid);
        console.log("location.reviews: ", location.reviews);
        console.log("req.params.reviewid: ", req.params.reviewid);
        console.log("review: ", review);

        // Review is NULL
        if (!review) {
          sendJsonResponse(res, 404, {
            "message": "reviewid not found"
          });
        }
        // Review is not NULL.  Build & Send response
        else {
          response = {
            location: {
              name: location.name,
              id: req.params.locationid
            },
            review: review
          };
          sendJsonResponse(res, 200, response);
        }
      }
      // No reviews found in location document
      else {
        sendJsonResponse(res, 404, {
          "message": "No reviews found"
        });
      }
    });
  }

  else {
    console.log("404: Not found, locationid & review are both required");
    sendJsonResponse(res, 404, { messages: "Not found, locationid & review are both required"});
  }
};
module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid & reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -ratings')
    .exec(
      function(err, location) {
        var thisReview;
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        }
        else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        if (location.review && location.reviews.length > 0) {
          thisReview = location.reviews.id(req.params.reviewid);
          if (!thisReview) {
            sendJsonResponse(res, 404, {
              "message": "reviewid not found"
            });
          }
          else {
            thisReview.author = res.body.author;
            thisReview.rating = req.body.rating;
            thisReviw.reviewText = req.body.reviewText;
            location.save(function(err, location){
              if (err) {
                sendJsonResponse(res, 404, err);
              }
              else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 200, thisReivew);
              }
            });
          }
        }
        else {
          sendJsonResponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
    );
};

module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
      function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        }
        else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0){
          if (!location.reviews.id(req.params.reviewid)) {
            sendJsonResponse(res, 404, {
              "message": "reviewid not found"
            });
          }
          else {
            location.reviews.id(req.params.reviewid).remove();
            location.save(function(err){
              if (err) {
                sendJsonResponse(res, 404, err);
              }
              else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 204, null);
              }
            });
          }
        }
        else {
          sendJsonResponse(res, 404, {
            "message": "No review to delete"
          });
        }
      }
    );
};

var mongoose = require('mongoose');
var Loc = mongoose.model('Location')

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.reviewsCreate = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});
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
  sendJsonResponse(res, 200, {"status" : "success"});

};
module.exports.reviewsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});

};

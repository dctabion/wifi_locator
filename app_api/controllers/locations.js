var mongoose = require('mongoose');
var Loc = mongoose.model('Location');


var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.locationsListByDistance = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});
};
module.exports.locationsCreate = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsReadOne = function(req, res) {
  console.log("Reading One: ", req.params);
  // if there are params and a locationid in the params
  if(req.params && req.params.locationid) {
    Loc.findById(req.params.locationid).exec(function(err, location){
      // Location ID not found
      if(!location) {
        sendJsonResponse(res, 404, { messages: "locationid not found"});
      }
      // DB error
      else if (err) {
        sendJsonResponse(res, 404, err);
      }
      // Found location.  Return location info
      sendJsonResponse(res, 200, location);
    });
  }
  else {
    console.log("No locationid in request");
    sendJsonResponse(res, 404, { messages: "No locationid in request"});
  }
};

module.exports.locationsUpdateOne = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});
};
module.exports.locationsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {"status" : "success"});
};

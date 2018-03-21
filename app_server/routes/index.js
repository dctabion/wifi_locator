var express = require('express');
var router = express.Router();
var ctrlOthers = require('../controllers/others');
var ctrlLocations = require('../controllers/locations');

/* Location pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/review/new', ctrlLocations.addReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;

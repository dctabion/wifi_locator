/* GET 'home' page */
module.exports.homelist = function (req, res) {
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with WIFI',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: [{
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 5,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '100m'
    }, {
      name: 'Dood\'s Place',
      address: '125 Low Street, Reading, RG6 1PS',
      rating: 1,
      facilities: ['Hot soup', 'Slop', 'Premium wifi'],
      distance: '50m'
     }, {
       name: 'Fred\'s Tavern',
       address: '123 sesame street, Reading, RG6 1PS',
       rating: 3,
       facilities: ['Green food', 'Bad service', 'Premium wifi'],
       distance: '10000m'
     }]
   });
};

/* GET 'Location info' page */
module.exports.locationInfo = function (req, res) {
  res.render('location-info', { title: 'Location Info'});
};


/* GET 'Add review' page */
module.exports.addReview = function (req, res) {
  res.render('location-review-form', { title: 'Add review'});
};

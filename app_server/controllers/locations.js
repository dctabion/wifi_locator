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
  res.render('location-review-form', { title: 'Add review'});
};

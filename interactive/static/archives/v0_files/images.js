var app = app || {};

(function(){
  // Getting and storing svg images
  app.images = {};
  jQuery.get(app.helpers.url('static/images/ok.svg'), function(data) {
    // Keep just for reference for next time. For this one I just want to get its path.
    // app.images.ok = jQuery(data).find('svg').html().replace(/ xmlns="[a-zA-Z1-9_]+"/g, '');
    app.images.ok = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/remove.svg'), function(data) {
    app.images.remove = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/remove2.svg'), function(data) {
    app.images.remove2 = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/star.svg'), function(data) {
    app.images.star = jQuery(data).find('svg > g > g').html();
  });
})();
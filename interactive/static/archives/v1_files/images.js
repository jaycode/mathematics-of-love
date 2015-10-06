var app = app || {};

(function(){
  /**
   * Getting and storing svg images. Used in {@link app.detailViz.drawMarker}.
   * @namespace app.images
   */
  app.images = {};
  jQuery.get(app.helpers.url('static/images/ok.svg'), function(data) {
    // Keep just for reference for next time. For this one I just want to get its path.
    // app.images.ok = jQuery(data).find('svg').html().replace(/ xmlns="[a-zA-Z1-9_]+"/g, '');
    /**
     * OK marker image.
     */
    app.images.ok = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/remove.svg'), function(data) {
    /**
     * Remove marker image.
     */
    app.images.remove = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/remove2.svg'), function(data) {
    /**
     * Remove marker image + circle around it.
     */
    app.images.remove2 = jQuery(data).find('svg > g > g').html();
  });
  jQuery.get(app.helpers.url('static/images/star.svg'), function(data) {
    /**
     * Star marker image.
     */
    app.images.star = jQuery(data).find('svg > g > g').html();
  });
})();
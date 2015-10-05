// Page to examine generated dataset.
var app = app || {};

(function(){
  /**
   * Generated Dataset page
   * ## Related Links
   * - {@link app.generatedViz}
   * @namespace app.generated
   */
  app.generated = {};

  /**
   * Changes currently displayed page to generated dataset page, then runs a callback.
   * @params {function} callback
   */
  app.generated.view = function(callback) {
    app.helpers.changePage('#main_viz-generated', function() {
      app.helpers.showLoading('#generated-plot_area');
      // Draw plots if data available.
      if (app.data.compatibilities.length > 0) {
        app.generatedViz.draw(app.data.compatibilities, '#generated-plot_area');
      }
      if (typeof(callback) == 'function') {
        callback();
      }
    });
  }
})();
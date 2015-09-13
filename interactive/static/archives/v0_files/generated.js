// Page to examine generated dataset.
var app = app || {};

(function(){
  app.generated = {};

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
// Page that controls the inputs to generate dataset.
var app = app || {};

(function(){
  app.generate = {};
  app.generate.view = function() {
    app.helpers.changePage('#main_viz-generate');
  };

  // Use callbackDirect for actions that should directly run without waiting
  // for dataset to be ready. On the other hand, callbackwait(data) can be used
  // for doing stuff with generated data.
  app.generate.generateDataset = function(callbackDirect, callbackWait) {
    // If last url is the same, don't repeat request.
    var url = app.helpers.dataUrl();

    if (app.data.last_url === url) {
      callbackWait(app.data.compatibilities);
    }
    else {
      d3.json(url, function(data) {
        app.data.compatibilities = data.compatibilities;
        callbackWait(app.data.compatibilities);
      });

      // Set experiment.processed to false.
      app.vm.Experiment.processed(false);

      // Also loads experiment-related data and set "processed" to true afterward.
      d3.json(app.helpers.experimentUrl(), function(data) {
        app.simulationAnalysis.updateExperiment(data.processed);

        // Set default random chosen lifetime.
        app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment._lifetimes()));
      });
    }
    callbackDirect();
  };
})();
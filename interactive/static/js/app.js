// Hub to all other pages and functions. Like header file in C++.
var app = app || {};

(function(){
  app.helpers = {};
  app.helpers.formatThousandSeparators = function(text) {
    return parseInt(text).toLocaleString();
  };

  app.helpers.parseNumberWithSeparators = function(text) {
    return parseInt(text.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"));
  };

  app.helpers.formatPercent = function(text) {
    return parseFloat(text) + '%';
  };

  app.helpers.parsePercent = function(text) {
    var regex = /\d+/g;
    var matches = text.match(regex);

    return parseInt(matches);
  };

  // "top-10%" to 10 and "%",
  // "top-5" to 5 and false.
  app.helpers.parseGoal = function(text) {
    var matches = text.match(/[0-9]+|%/g);
    var topX = parseFloat(matches[0]);
    var percent = true;
    if (matches[1] !== '%') {
      percent = false;
    }
    return [topX, percent];
  };

  // Show "now loading" area at given selector.
  app.helpers.showLoading = function(selector) {
    d3.select(selector)
      .html('<div class="now_loading">Drawing, please wait...</div>');
  };

  // Change page into selector's element.
  // Run callback after all animations completed.
  app.helpers.changePage = function(selector, callback) {
    d3.select('#main_viz .is_active')
      .transition()
      .style('opacity', 0)
      .each('end', function() {
        d3.select('#main_viz .is_active')
          .classed('is_active', false);
        d3.select(selector)
          .transition()
          .style('opacity', 1)
          .each('end', function() {
            d3.select(selector)
            .classed('is_active', true);
            if (typeof(callback) != 'undefined') {
              callback();
            }
          });
      });
  };

  // Similar to assert (I used the naming style from R).
  app.helpers.stopifnot = function(condition, message) {
    if (!condition) {
      message = message || "Assertion failed";
      if (typeof Error !== "undefined") {
        throw new Error(message);
      }
      throw message; // Fallback
    }
    else {
      console.log("Assertion passed");
    }
  }

  // Get raw data url
  app.helpers.dataUrl = function() {
    return 'data?l=' + 
      app.vm.Experiment.lifetimes() +
      '&a1=' +
      app.vm.Experiment.a1() +
      '&a2=' +
      app.vm.Experiment.a2() +
      '&p1=' +
      app.vm.Experiment.p1() +
      '&p2=' +
      app.vm.Experiment.p2();
  }

  // Get experiment url 
  app.helpers.experimentUrl = function() {
    return app.helpers.dataUrl() +
      '&p=1' +
      '&g=' + _.map(app.data.experiment.goals, function(v) {return v.name;}).join(',');
  }

  app.ViewModel = function() {
    var self = this;

    this.CurrentDetail = new app.CurrentDetail(app.data.currentDetail);
    this.Experiment = new app.Experiment(app.data.experiment);
    
    this.viewSimulationAnalysis = function() {
      app.simulationAnalysis.view();
    };
    this.viewGenerateDataset = function() {
      app.generate.view();
    };
    this.viewGeneratedDataset = function() {
      app.generated.view();
    };
    this.viewDetail = function() {
      app.detail.view();
    };

    this.generateDataset = function() {
      app.generate.generateDataset();
    };

    this.chooseGoal = function() {
      app.detail.chooseGoal();
    };

    this.addGoal = function() {
      app.dataAnalysis.addGoal();
    };

    this.removeGoal = function() {
      app.dataAnalysis.removeGoal();
    };

    // Maybe not needed:
    this.hoverDetailedBar;
    this.hoverMainDataPoint;
    this.hoverIntroDataPoint;
  };

  var buttons = d3.select('button[data-bind=btn-start]')
    .on('click', function() {
      d3.select(this)
        .transition()
        .style('opacity', 0)
        .each('end', function() {
          d3.select('#start_button_container')
            .remove();
        });

      // Apply bindings, then generate dataset based on values in data.
      app.vm = new app.ViewModel();
      ko.applyBindings(app.vm);
      app.generate.generateDataset(function() {
        // Display initial view (generated dataset).
        app.vm.viewGeneratedDataset();
      }, function(data) {
        app.generatedViz.draw(data, '#generated-plot_area');
      });
    });

  d3.json("data/intro", app.introViz.drawIntro);
})();
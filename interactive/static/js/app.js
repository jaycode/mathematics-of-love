// This is the main section of our application where we define our
// ViewModels and helpers.
var app = app || {};

(function(){
  app.helpers = {};
  // 10000 to 10,000.
  app.helpers.formatThousandSeparators = function(text) {
    return parseInt(text).toLocaleString();
  };

  // 10,000 to 10000.
  app.helpers.parseNumberWithSeparators = function(text) {
    return parseInt(text.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"));
  };

  // Adding percentage for lazy people like me.
  app.helpers.formatPercent = function(text) {
    return parseFloat(text) + '%';
  };

  // Remove percentage and get its number.
  app.helpers.parsePercent = function(text) {
    var regex = /\d+/g;
    var matches = text.match(regex);
    if (typeof(matches) == 'undefined') {
      var number = 0;
    }
    else {
      var number = parseInt(matches);
    }

    return number;
  };

  // "top-10%" to 10 and "%",
  // "top-5" to 5 and false.
  app.helpers.parseGoal = function(text) {
    var matches = text.match(/[0-9]+|%/g);
    if (matches == null || matches.length == 0) {
      return [1, false];
    }
    else {
      var topX = parseFloat(matches[0]);
      var percent = true;
      if (matches[1] !== '%') {
        percent = false;
      }
      return [topX, percent];
    }
  };

  // Using d3.nest to group compatibilities by lifetimes.
  // This will later be used in DetailViz.
  app.helpers.groupCompatibilitiesByLifetime = function(compatibilities) {
    // Find number of total candidates within this lifetime from compatibilities dataset.
    var nested = d3.nest()
      .key(function(d) {
        return d['lifetime'];
      })
      .rollup(function(leaves) {
        return {
          'total_candidates': leaves.length,
          'candidates': leaves
        };
      })
      .entries(compatibilities);
    return nested;
  };

  // Getting url to our server.
  app.helpers.url = function(path) {
    return window.location.protocol + '//' + window.location.host + '/' + path;
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
    // return 'http://159.203.71.247/data?l=' + 
    return 'data?l=' + 
      app.vm.Generator._lifetimes() +
      '&a1=' +
      app.vm.Generator.a1() +
      '&a2=' +
      app.vm.Generator.a2() +
      '&p1=' +
      app.vm.Generator.p1() +
      '&p2=' +
      app.vm.Generator.p2();
  }

  // Get experiment url 
  app.helpers.experimentUrl = function() {
    return app.helpers.dataUrl() +
      '&p=1' +
      '&g=' + _.map(app.vm.Experiment.goals(), function(v) {return v.name();}).join(',');
  }

  // Picks one of 20 colors in cycle.
  app.helpers.pickColor = function(i) {
    return d3.scale.category20().domain(_.range(0,20))(i%20);
  }

  // Our main ViewModel.
  app.ViewModel = function() {
    var self = this;

    self.Generator = new app.Generator(app.data.generator);
    self.Experiment = new app.Experiment(app.data.experiment);
    self.CurrentDetail = new app.CurrentDetail(self, app.data.currentDetail);
    
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
            .style('height', 0);
        })

      // Apply bindings, then generate dataset based on values in data.
      app.vm = new app.ViewModel();
      ko.applyBindings(app.vm);
      app.vm.Generator.generateDataset(function() {

      }, function(data) {
        // Set initial lifetime
        app.vm.CurrentDetail.lifetime(165);
        app.vm.CurrentDetail.activeGoal().active(true);

        app.tour = new Tour(app.getTourSettings());
        app.setupTourFunctions();
        app.detail.view(function() {
          app.tour.init();
          app.tour.start(true);          
        });
      });
    });

  d3.json("data/intro", app.introViz.drawIntro);
})();
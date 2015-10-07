/**
 * This is the main section of our application where we define our
 * ViewModels and helpers.
 * - ViewModel names are capitalized e.g. {@link app.Goal}, {@link app.ViewModel}, {@link app.Experiment}, etc.
 * - For everything else use standard camelcase e.g. `app.simulationAnalysis`.
 * - ViewModel can be accessed using `app.vm`. Use this to get data e.g. `app.vm.CurrentDetail.lifetime()`.
 * - All pages have their own instances:
 *   - {@link app.simulationAnalysis} for main analysis page.
 *   - {@link app.detail} for the page when you clicked on "View more detail".
 *   - {@link app.generate} for generate data page.
 *   - {@link app.generated} for 'review generated data' page.
 * - All these pages are stored inside templates within index.html.
 * - Helper methods are stored in {@link app.helpers}.
 * - All data are prefixed with `data` e.g. {@link app.data.experiment}
 * @namespace app
 */
var app = app || {};

(function(){
  /** 
   * Helpers used throughout the app.
   * @namespace app.helpers
   */
  app.helpers = {};
  /**
   * Adds commas to number string, for example "10000" to "10,000".
   * @param {string|number} text String of number to we will add commas for.
   *   Due to how javascript works, you can pass in numbers as well.
   * @return {string} String of number with commas added.
   */
  app.helpers.formatThousandSeparators = function(text) {
    return parseInt(text).toLocaleString();
  };

  /**
   * Removes commas from given number string.
   * For example it converts "10,000" to 10000. This is useful for
   * preprocessing number prior to entering it to models.
   * @param {string} text String of number with comma separators.
   * @return {number} Numeric representation of given string.
   */
  app.helpers.parseNumberWithSeparators = function(text) {
    return parseInt(text.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"));
  };

  /**
   * Simply add percentage symbol to a text.
   * Parse that text into float before conversion,
   * just to make sure that given text is a number, and it converts
   * NaN to 0.0.
   * @param {string|number} text String of number.
   * @return {string} String + percent symbol (%).
   */
  app.helpers.formatPercent = function(text) {
    return parseFloat(text) + '%';
  };

  /**
   * Remove percent symbol (%) from a given string and return its numeric
   * representation. Useful for preprocessing prior to entering to models.
   * @param {string} text String of number + percent symbol.
   * @return {number} Numeric representation of the text percentage.
   */
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

  /**
   * Parse goal text into an Array of number and symbol.
   * For example, "top-10%" to 10 and "%",
   * "top-5" to 5 and false.
   * @param {string} text Goal string.
   * @return {array} [number, symbol] Symbol could either be '%'
   *   or false.
   */
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

  /**
   * Grouping compatibilities by lifetimes with d3.nest.
   * This will later be used in DetailViz.
   * @param {array} compatibilities Array of compatibilities stored
   *   in the dataset.
   * @return {array} An array of nested data returned by d3.nest.
   */
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

  /**
   * Getting url to server + given path.
   * @param {string} path Path to be added next to server url
   * @return {string} Url + path, for example "http:4123//serverpath.com/thepath" where
   *   "thepath" is given path.
   */
  app.helpers.url = function(path) {
    return window.location.protocol + '//' + window.location.host + '/' + path;
  };

  /**
   * Show "now loading" area at given selector.
   * @param {string} selector CSS selector where loading element will be added into.
   */
  app.helpers.showLoading = function(selector) {
    d3.select(selector)
      .html('<div class="now_loading">Drawing, please wait...</div>');
  };

  /**
   * Change page into selector's element.
   * Run callback after all animations completed.
   * @param {string} selector
   * @param {function|null} callback Function to run after page changed.
   */
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

  /**
   * A function similar to assert. Stop app execution
   * when given condition not met + show message.
   * @param {boolean} condition Boolean to test.
   * @param {string} message Message to display on error.
   */
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

  /**
   * Get raw data url based on current parameters.
   * @return {string} Data url e.g. 'http://159.203.71.247/data?l=100&a1=20&a2=30&p1=0&p2=8'
   */
  app.helpers.dataUrl = function() {
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

  /**
   * Get experiment url. Experiment dataset is used in details page where we
   * show each simulated experiment.
   * @return {string} Experiment url.
   */
  app.helpers.experimentUrl = function() {
    return app.helpers.dataUrl() +
      '&p=1' +
      '&g=' + _.map(app.vm.Experiment.goals(), function(v) {return v.name();}).join(',');
  }

  /**
   * Picks one of 20 colors in cycle. This is used to color goal related items
   * (boxes and lines).
   */
  app.helpers.pickColor = function(i) {
    return d3.scale.category20().domain(_.range(0,20))(i%20);
  }

  /**
   * Function to convert bytes to human readable string. Used in progress loads.
   */
  app.helpers.getReadableFileSizeString = function(fileSizeInBytes) {

      var i = -1;
      var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
      do {
          fileSizeInBytes = fileSizeInBytes / 1024;
          i++;
      } while (fileSizeInBytes > 1024);

      return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  };

  /**
   * Our main ViewModel.
   * @class app.ViewModel
   */
  app.ViewModel = function() {
    var self = this;

    /**
     * Call app.ViewModel.Generator to reference app.Generator ViewModel.
     * You can get data stored in {@code app.data.generator} from it.
     * @memberOf app.ViewModel
     */
    self.Generator = new app.Generator(app.data.generator);

    /**
     * Call app.ViewModel.Experiment to reference app.Experiment ViewModel.
     * You can get data stored in {@code app.data.experiment} from it.
     * @memberOf app.ViewModel
     */
    self.Experiment = new app.Experiment(app.data.experiment);

    /**
     * Call app.ViewModel.CurrentDetail to reference app.CurrentDetail ViewModel.
     * You can get data stored in app.data.currentDetail from it.
     * @memberOf app.ViewModel
     */
    self.CurrentDetail = new app.CurrentDetail(self, app.data.currentDetail);
    
    /**
     * View Simulation Analysis page, the one showing several lines in it.
     */
    this.viewSimulationAnalysis = function() {
      app.simulationAnalysis.view();
    };

    /**
     * View Generate Dataset page.
     */
    this.viewGenerateDataset = function() {
      app.generate.view();
    };

    /**
     * View Generated Dataset page.
     */
    this.viewGeneratedDataset = function() {
      app.generated.view();
    };

    /**
     * View Detail page. The one showing many single-life simulations.
     */
    this.viewDetail = function() {
      app.detail.view();
    };
  };

  var buttons = d3.select('button[data-bind=btn-start]')
    .on('click', function() {
      var button = this;
      d3.select(button)
        .attr('disabled', true)
        .text('Loading the app, please wait...')
      // Apply bindings, then generate dataset based on values in data.
      app.vm = new app.ViewModel();
      ko.applyBindings(app.vm);
      app.vm.Generator.generateDataset(function() {
      }, function(data) {
        d3.select('#links_area')
          .style('opacity', 0)
          .classed('hide', false)
          .transition()
          .style('opacity', 1);

        d3.select(button)
          .transition()
          .style('opacity', 0)
          .each('end', function() {
            d3.select('#start_button_container')
              .style('height', 0);
          })

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

  if (d3.select('#intro_viz').empty() != true) {
    d3.json("data/intro", function(error, data) {
      app.introViz.drawIntro(data);
    });
  }
})();
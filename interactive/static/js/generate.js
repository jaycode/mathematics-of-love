var app = app || {};

(function(){
  /**
   * Generate dataset page (Page that controls the inputs to generate dataset).
   * ## Related Links
   * - {@link app.Generator}
   * @namespace app.generate
   */
  app.generate = {};

  /**
   * Change currently displayed page to generate dataset page.
   */
  app.generate.view = function() {
    app.helpers.changePage('#main_viz-generate');
  };

  /**
   * ViewModel that relates to generate dataset page. Singleton instance is available as `app.vm.Generator`.
   * ## Related Links
   * - {@link app.generate}
   * - {@link app.data.generator}
   * @param {Array} data Pass {@link app.data.generator} data to initialize this.
   * @class app.Generator
   */
  app.Generator =  function(data) {
    var self = this;
    /**
     * Observed validated status of the form.<br />
     * Form can be submitted only when this is true.
     */
    this.validated = ko.observable(true);

    /**
     * Observed {@link app.data.generator.a1 age start}.
     * @type {ko.observable}
     * @return {number}
     */
    this._a1 = ko.observable(data['a1']);
    
    /** 
     * Observed {@link app.data.generator.a2 age end}.
     * @type {ko.observable}
     * @return {number}
     */
    this._a2 = ko.observable(data['a2']);

    /**
     * Observed {@link app.data.generator.p1 minimum potential partners per year}.
     * @type {ko.observable}
     * @return {number}
     */
    this._p1 = ko.observable(data['p1']);

    /**
     * Observed {@link app.data.generator.p2 maximum potential partners per year}.
     * @type {ko.observable}
     * @return {number}
     */
    this._p2 = ko.observable(data['p2']);

    /**
     * Computed age start. Use this to read and write to age start from bound element in HTML.
     * @type {ko.computed}
     * @namespace app.Generator#a1
     */
    this.a1 = ko.computed({
      /**
       * Returns age start.
       * @return {number}
       * @memberOf app.Generator#a1
       */
      read: function() {
        return self._a1();
      },
      /**
       * Validates before saving age start.
       * @memberOf app.Generator#a1
       * @params {string|number} value
       */
      write: function(value) {
        self._a1(parseInt(value));
        self.validate();
      }
    });

    /**
     * Computed age end. Use this to read and write to age end from bound element in HTML.
     * @type {ko.computed}
     * @namespace app.Generator#a2
     */
    this.a2 = ko.computed({
      /**
       * Returns age end.
       * @return {number}
       * @memberOf app.Generator#a2
       */
      read: function() {
        return self._a2();
      },
      /**
       * Validates before saving age end.
       * @memberOf app.Generator#a2
       * @params {string|number} value
       */
      write: function(value) {
        self._a2(parseInt(value));
        self.validate();
      }
    });

    /**
     * Computed minimum potential partners per year.
     * Use this to read and write to min potential partners from bound element in HTML.
     * @type {ko.computed}
     * @namespace app.Generator#p1
     */
    this.p1 = ko.computed({
      /**
       * Returns min potential partners.
       * @return {number}
       * @memberOf app.Generator#p1
       */
      read: function() {
        return self._p1();
      },
      /**
       * Validates before saving min potential partners.
       * @memberOf app.Generator#p1
       * @params {string|number} value
       */
      write: function(value) {
        self._p1(parseInt(value));
        self.validate();
      }
    });

    /**
     * Computed maximum potential partners per year.
     * Use this to read and write to max potential partners from bound element in HTML.
     * @type {ko.computed}
     * @namespace app.Generator#p2
     */
    this.p2 = ko.computed({
      /**
       * Returns max potential partners.
       * @return {number}
       * @memberOf app.Generator#p2
       */
      read: function() {
        return self._p2();
      },
      /**
       * Validates before saving max potential partners.
       * @memberOf app.Generator#p2
       * @params {string|number} value
       */
      write: function(value) {
        self._p2(parseInt(value));
        self.validate();
      }
    });

    /**
     * Observed number of lifetimes to simulate.
     * @type {ko.observable}
     * @return {number}
     */
    this._lifetimes = ko.observable(data['lifetimes']);

    /**
     * Computed number of lifetimes.
     * Use this to read and write to number of lifetimes from bound element in HTML.
     * @type {ko.computed}
     * @namespace app.Generator#lifetimes
     */
    this.lifetimes = ko.computed({
      /**
       * Returns number of lifetimes, {@link app.helpers.formatThousandSeparators separated by commas}.
       * @return {number}
       * @memberOf app.Generator#lifetimes
       */
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetimes());
      },
      /**
       * Validates before saving number of lifetimes.
       * @memberOf app.Generator#lifetimes
       * @param {string|number} value Could be "10,000" or "10000".
       */
      write: function(value) {
        self._lifetimes(app.helpers.parseNumberWithSeparators(value));
        self.validate();
      }
    });

    /**
     * Submits generate form. Runs validation before submission.
     * @params {object} formElement
     */
    this.submitGenerateForm = function(formElement) {
      var self = this;

      if (self.validate()) {
        self.generateDataset(function() {
          // Display initial view (generated dataset).
          app.generated.view();
        }, function(data) {
          app.generatedViz.draw(app.data.compatibilities, '#generated-plot_area');
          app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment._lifetimes()));
        });
      }
    }

    self.ageErrorText = "Age difference must be between " + app.data.settings.min_age_diff + " and " + app.data.settings.max_age_diff;
    self.ppErrorText = "keep partners between " + app.data.settings.min_potential_partners + " - " + app.data.settings.max_potential_partners;
    self.lifetimesErrorText = "Lifetimes must be between " + app.helpers.formatThousandSeparators(app.data.settings.min_lifetimes) +
     " and " + app.helpers.formatThousandSeparators(app.data.settings.max_lifetimes) + " (sorry, my server's just not strong enough).";

    self.a1Error = ko.observable(false);
    self.a2Error = ko.observable(false);
    self.p1Error = ko.observable(false);
    self.p2Error = ko.observable(false);
    self.lifetimesError = ko.observable(false);
    /**
     * Validation method.
     */
    this.validate = function() {
      var self = this;

      self.a1Error(false);
      self.a2Error(false);
      self.p1Error(false);
      self.p2Error(false);
      self.lifetimesError(false);

      var error = false;
      var value = self.a2()-self.a1();

      if (value < app.data.settings.min_age_diff || value > app.data.settings.max_age_diff) {
        self.a1Error(true);
        self.a2Error(true);
        error = true;
      }

      [self.p1(), self.p2()].forEach(function(value, i) {
        if (value < app.data.settings.min_potential_partners || value > app.data.settings.max_potential_partners) {
          // Dynamic function calls.
          self['p'+(i+1)+'Error'](true);
          error = true;
        }
      });

      if (self._lifetimes() < app.data.settings.min_lifetimes || self._lifetimes() > app.data.settings.max_lifetimes) {
        // Dynamic function calls.
        self['lifetimesError'](true);
        error = true;
      }
      self.validated(!error);
      return !error;
    }

    /**
     * Generate dataset then run callbacks after done.
     * @param {function} callbackDirect Use callbackDirect for actions that should directly run without waiting
     *   for dataset to be ready.
     * @param {function(data)} callbackWait Use callbackWait for doing stuff with generated data.
     * @param {Array} callbackWait.data Data passed to callbackWait function.
     */
    this.generateDataset = function(callbackDirect, callbackWait) {
      var self = this;

      app.vm.Experiment.a1(self.a1());
      app.vm.Experiment.a2(self.a2());
      app.vm.Experiment.p1(self.p1());
      app.vm.Experiment.p2(self.p2());
      app.vm.Experiment._lifetimes(self._lifetimes());
      app.data.compatibilities = [];
      
      app.vm.Experiment.processed(false);

      // If last url is the same, don't repeat request.
      var url = app.helpers.dataUrl();

      if (app.data.last_url === url) {
        callbackWait(app.data.compatibilities);
      }
      else {
        d3.json(url, function(data) {
          app.data.compatibilities = data.compatibilities;
          // Set experiment.processed to false.

          // Also loads experiment-related data and set "processed" to true afterward.
          d3.json(app.helpers.experimentUrl(), function(data1) {
            app.simulationAnalysis.updateExperiment(data1.processed);

            // Set default random chosen lifetime.
            // Not needed since this caused initial load update detail page several times
            // and broke the tour feature. Instead, set lifetime in 
            // callbackWait method.
            // app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment._lifetimes()));

            if (typeof(callbackWait) == 'function') {
              callbackWait(app.data.compatibilities);
            }
          });
        });
      }
      if (typeof(callbackDirect) == 'function') {
        callbackDirect();
      }
    };
  };

})();
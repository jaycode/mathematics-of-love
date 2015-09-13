// Page that controls the inputs to generate dataset.
var app = app || {};

(function(){
  app.generate = {};
  app.generate.view = function() {
    app.helpers.changePage('#main_viz-generate');
  };

  app.Generator =  function(data) {
    var self = this;
    this.validated = ko.observable(true);
    this._a1 = ko.observable(data['a1']);
    this._a2 = ko.observable(data['a2']);
    this._p1 = ko.observable(data['p1']);
    this._p2 = ko.observable(data['p2']);

    this.a1 = ko.computed({
      read: function() {
        return self._a1();
      },
      write: function(value) {
        self._a1(parseInt(value));
        self.validate();
      }
    });
    this.a2 = ko.computed({
      read: function() {
        return self._a2();
      },
      write: function(value) {
        self._a2(parseInt(value));
        self.validate();
      }
    });
    this.p1 = ko.computed({
      read: function() {
        return self._p1();
      },
      write: function(value) {
        self._p1(parseInt(value));
        self.validate();
      }
    });
    this.p2 = ko.computed({
      read: function() {
        return self._p2();
      },
      write: function(value) {
        self._p2(parseInt(value));
        self.validate();
      }
    });
    this._lifetimes = ko.observable(data['lifetimes']);
    this.lifetimes = ko.computed({
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetimes());
      },
      write: function(value) {
        self._lifetimes(app.helpers.parseNumberWithSeparators(value));
        self.validate();
      }
    });

    this.submitGenerateForm = function(formElement) {
      var self = this;

      if (self.validate()) {
        // d3.select('#generate-now_loading_bg')
        //   .transition()
        //   .style('opacity', 1);
        // d3.select('#generate-now_loading')
        //   .transition()
        //   .delay(100)
        //   .style('opacity', 1);

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
    self.ppErrorText = "Number of potential partners must be between " + app.data.settings.min_potential_partners + " and " + app.data.settings.max_potential_partners;
    self.lifetimesErrorText = "Lifetimes must be between " + app.helpers.formatThousandSeparators(app.data.settings.min_lifetimes) +
     " and " + app.helpers.formatThousandSeparators(app.data.settings.max_lifetimes) + " (sorry, my server's just not strong enough).";

    self.a1Error = ko.observable(false);
    self.a2Error = ko.observable(false);
    self.p1Error = ko.observable(false);
    self.p2Error = ko.observable(false);
    self.lifetimesError = ko.observable(false);
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

    // Use callbackDirect for actions that should directly run without waiting
    // for dataset to be ready. On the other hand, callbackwait(data) can be used
    // for doing stuff with generated data.
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
// SimulationAnalysis page
var app = app || {};

(function() {
  app.simulationAnalysis = {};

  // View SimulationAnalysis page
  app.simulationAnalysis.view = function() {
    app.helpers.changePage('#main_viz-simulation_analysis', function() {
      app.helpers.showLoading('#simulation_analysis-plot_area');
      app.mainViz.draw(app.data.experiment, '#simulation_analysis-plot_area');
    });
  }

  app.Goal = function(data) {
    this.name = ko.computed(function() {
      var matches = data['name'].match(/[a-zA-Z0-9%]+/g);
      return matches.join(' ');
    }, this);
    this.getClass = ko.computed(function() {
      return app.data.settings['colors'][data['color_id']]['class'];
    });
  }

  // ViewModel to display in this page.
  app.Experiment = function(data) {
    var self = this;
    this._lifetimes = ko.observable(data['lifetimes']);
    this.lifetimes = ko.computed(function() {
      return app.helpers.formatThousandSeparators(self._lifetimes());
    }, this);

    this.a1 = ko.observable(data['a1']);
    this.a2 = ko.observable(data['a2']);
    this.p1 = ko.observable(data['p1']);
    this.p2 = ko.observable(data['p2']);

    this.goals = ko.observableArray([]);
    data.goals.forEach(function(goal) {
      self.goals.push(new app.Goal(goal));
    });

    this.processed = ko.observable(data['processed']);

    this.addGoal = function() {

    };

  }

  // Update Experiment with data from server.
  app.simulationAnalysis.updateExperiment = function(data) {
    app.data.experiment.goals.forEach(function(goal, i) {
      app.data.experiment.goals[i]['data'] = data[goal['name']];
    });
    app.vm.Experiment.processed(true);
  }

})();
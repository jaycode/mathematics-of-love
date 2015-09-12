// SimulationAnalysis page
var app = app || {};

(function() {
  app.simulationAnalysis = {};

  // View SimulationAnalysis page
  app.simulationAnalysis.view = function(callback) {
    app.helpers.changePage('#main_viz-simulation_analysis', function() {
      app.simulationAnalysis.redrawPlot(callback);
    });
  }
  app.simulationAnalysis.redrawPlot = function(callback) {
    app.helpers.showLoading('#simulation_analysis-plot_area');
    app.mainViz.draw(ko.toJS(app.vm.Experiment), '#simulation_analysis-plot_area', callback);
  }

  app.Goal = function(data) {
    this.name = ko.computed(function() {
      var matches = data['name'].match(/[a-zA-Z0-9%]+/g);
      return matches.join(' ');
    }, this);
    this.getClass = ko.computed(function() {
      return app.data.settings['colors'][data['color_id']]['class'];
    });
    this.color_id = ko.observable(data['color_id']);
    this.destructible = ko.observable(data['destructible']);
    this.active = ko.observable(data['active']);
    this.data = data['data']; // no need to observe this (I guess?)
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
      if (d3.select('#sa-hidden_inputs').classed('active')) {
        var value = parseInt(d3.select('#sa-hidden_inputs input').property('value'));
        var type = d3.select('#sa-hidden_inputs select').property('value');
        if (app.simulationAnalysis.validateGoal(value, type)) { 
          data = {
            name: 'top-'+value+type,
            active: true,
            color_id: self.goals().length,
            destructible: true,
          }
          self.goals.push(new app.Goal(data));
          app.vm.CurrentDetail.goals.push(new app.DetailGoal(app.vm, {
            goal_id: self.goals().length - 1,
            active: false,
            success_rate: 0,
            data: []
          }));

          // Connect to server to update experiment data.
          d3.json(app.helpers.experimentUrl(), function(data1) {
            app.simulationAnalysis.updateExperiment(data1.processed);
            app.simulationAnalysis.redrawPlot();
          });

          this.cancelAddGoal();
        }
      }
      else {
        if (app.vm.Experiment.goals().length >= app.data.settings.max_goals) {
          alert("Can't have more than " + app.data.settings.max_goals + ". Remove some goals before adding more.");
        }
        else {
          d3.select('#sa-hidden_inputs')
            .classed('active', true)
            .transition()
            .style('width', d3.select('#sa-hidden_inputs div').style('width'));
          d3.select('#sa-add_goal')
            .text('Create');
        }
      }
    };

    this.cancelAddGoal = function() {
      d3.select('#sa-hidden_inputs')
        .classed('active', false)
        .transition()
        .style('width', '0px');
      d3.select('#sa-add_goal')
        .text('Add');
    }

  }
  
  app.simulationAnalysis.validateGoal = function(value, type) {
    errors = [];
    if (!(value >= app.data.settings.min_rejection_phase && value <= app.data.settings.max_rejection_phase)) {
      errors.push("Value must be between " + app.data.settings.min_rejection_phase + ' and ' + app.data.settings.max_rejection_phase + ".");
    }
    if (type != '' && type != '%') {
      errors.push("Please choose a type.");
    }
    app.vm.Experiment.goals().forEach(function(goal) {
      var goalval = app.helpers.parseGoal(goal.name());
      if (goalval[1]) {
        goalval[1] = '%';
      }
      else {
        goalval[1] = '';
      }
      if ( goalval[0] == value && goalval[1] == type) {
        errors.push("Value " + goal.name() + " already exists. Try another one.");
      }
    });

    if (errors.length > 0) {
      alert(errors.join('<br />'))
    }

    return errors.length == 0
  };

  // Update Experiment with data from server.
  app.simulationAnalysis.updateExperiment = function(data) {
    app.vm.Experiment.goals().forEach(function(goal, i) {
      app.vm.Experiment.goals()[i].data = data[goal.name()];
      app.vm.CurrentDetail.goals()[i].success_rate(data[goal.name()][app.vm.CurrentDetail._rejection_phase()]);
    });
    app.vm.Experiment.processed(true);
  }

})();
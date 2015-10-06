// SimulationAnalysis page
var app = app || {};

(function() {
  /**
   * A module where functions to do stuff on {@link app.mainViz} are kept.
   * ## Related Links
   * - {@link app.Experiment}
   * - {@link app.mainViz}
   * @namespace app.simulationAnalysis
   */
  app.simulationAnalysis = {};

  /**
   * Changes currently displayed page to simulation analysis page, then runs a callback function.
   * @param {function} callback
   */
  app.simulationAnalysis.view = function(callback) {
    app.helpers.changePage('#main_viz-simulation_analysis', function() {
      app.simulationAnalysis.redrawPlot(callback);
    });
  }

  /**
   * Redraws {@link app.mainViz}, then runs a callback function.
   * @param {function} callback
   */
  app.simulationAnalysis.redrawPlot = function(callback) {
    app.helpers.showLoading('#simulation_analysis-plot_area');
    app.mainViz.draw(ko.toJS(app.vm.Experiment), '#simulation_analysis-plot_area', callback);
  }

  /**
   * Goal ViewModel, relates to goals in Simulation Analysis page.<br />
   * The data here are initialized from {@link app.data.experiment.goals.goal goal data object}.
   * ## Related Links
   * - {@link app.Experiment}
   * - {@link app.simulationAnalysis}
   * - {@link app.data.experiment.goals}
   * @param {app.data.experiment.goals.goal} data Settings data of a goal.
   * @namespace app.Goal
   */
  app.Goal = function(data) {
    this.id = ko.observable(data['id']);
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
    this.showMenu = function(goal, e, i, j) {
      d3.selectAll('.remove_goal_area')
        .style('opacity', 0)
        .transition();
      var id = _.findIndex(app.vm.Experiment.goals(), function(g) {return g.name() == goal.name();});
      d3.select(d3.selectAll('.remove_goal_area')[0][id])
        .transition()
        .style('opacity', 1);
    }
    this.hideMenu = function(goal, e) {
      if (goal.destructible()) {
        d3.selectAll('.remove_goal_area')
          .transition()
          .style('opacity', 0);
      }
    }
    this.remove = function(goal, e) {
      if (goal.destructible()) {
        var detailGoal = _.find(app.vm.CurrentDetail.goals(), function(g) {return g.name() == goal.name();});
        app.vm.CurrentDetail.goals.remove(detailGoal);
        var changeActive = false;
        if (goal.active()) {
          changeActive = true;
        }
        app.vm.Experiment.goals.remove(goal);
        if (changeActive) {
          app.vm.Experiment.goals()[0].active(true);
        }
        app.helpers.showLoading('#simulation_analysis-plot_area')
          d3.json(app.helpers.experimentUrl(), function(data1) {
            app.simulationAnalysis.updateExperiment(data1.processed);
            app.simulationAnalysis.redrawPlot();
          });
      }
    }
  }

  /**
   * ViewModel related to an experiment, displayed in SimulationAnalysis page.<br />
   * Singleton instance is available as `app.vm.Experiment`.
   * @param {app.data.experiment} data Settings data of an experiment.
   * @class app.Experiment
   */
  app.Experiment = function(data) {
    var self = this;

    /**
     * Observed {@link app.data.experiment.lifetime}.<br />
     * Use `_lifetime` (or other `_varname`) method to access the numeric values directly,
     * but for other needs e.g. updating or display, use `lifetime` (or `varname`) method.
     * @type {ko.observable}
     * @return {number}
     */
    this._lifetimes = ko.observable(data['lifetimes']);

    /**
     * Computed class to get value of lifetimes and {@link app.helpers.formatThousandSeparators format thousand separators}.
     * @type {ko.computed}
     * @return {string}
     * @namespace app.Experiment#lifetime
     */
    this.lifetimes = ko.computed(function() {
      return app.helpers.formatThousandSeparators(self._lifetimes());
    }, this);

    /**
     * Observed {@link app.data.experiment.a1 age start}.
     * @type {ko.observable}
     * @return {number}
     */
    this.a1 = ko.observable(data['a1']);

    /**
     * Observed {@link app.data.experiment.a2 age end}.
     * @type {ko.observable}
     * @return {number}
     */
    this.a2 = ko.observable(data['a2']);

    /**
     * Observed {@link app.data.experiment.p1 minimum potential partners per year}.
     * @type {ko.observable}
     * @return {number}
     */
    this.p1 = ko.observable(data['p1']);

    /**
     * Observed {@link app.data.experiment.p2 maximum potential partners per year}.
     * @type {ko.observable}
     * @return {number}
     */
    this.p2 = ko.observable(data['p2']);

    /**
     * Observed {@link app.data.experiment.goals array of goals} containing multiple {@link app.Goal Goal} ViewModels.
     * @type {ko.observableArray}
     */
    this.goals = ko.observableArray([]);
    data.goals.forEach(function(goal) {
      self.goals.push(new app.Goal(goal));
    });

    /**
     * Observed {@link app.data.experiment.processed processed} status.<br />
     * If processed is true, do not process again.<br />
     * Set processed to false when generating new compatibilities
     * i.e. {@link app.generate.generateDataset}.
     */
    this.processed = ko.observable(data['processed']);

    /**
     * A function to be bound to "Add Goal" button in the HTML. The first call to this function
     * will show input text for user to enter the setting of this new goal, while the second call will
     * confirm its creation.<br />
     * Validates goal adding with function {@link app.simulationAnalysis.validateGoal}.
     */
    this.addGoal = function() {
      if (d3.select('#sa-hidden_inputs').classed('active')) {
        var value = parseInt(d3.select('#sa-hidden_inputs input').property('value'));
        var type = d3.select('#sa-hidden_inputs select').property('value');
        if (app.simulationAnalysis.validateGoal(value, type)) {

          var newId = _.max(self.goals(), function(goal) {return goal.id();}).id() + 1;
          data = {
            name: 'top-'+value+type,
            active: true,
            color_id: newId,
            destructible: true,
            id: newId
          }
          self.goals.unshift(new app.Goal(data));
          app.vm.CurrentDetail.goals.unshift(new app.DetailGoal(app.vm, {
            goal_id: newId,
            active: false,
            success_rate: 0,
            data: []
          }));

          // Connect to server to update experiment data.
          app.helpers.showLoading('#simulation_analysis-plot_area')
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

    /**
     * A function to be bound to "Cancel Add Goal" button in HTML. Pressing this will cancel the
     * current goal adding process.
     */
    this.cancelAddGoal = function() {
      d3.select('#sa-hidden_inputs')
        .classed('active', false)
        .transition()
        .style('width', '0px');
      d3.select('#sa-add_goal')
        .text('Add');
    }

  }
  
  /**
   * Validates the goal about to be added with {@link app.Experiment#addGoal} function.
   * @param {number} value Rejection phase of the goal e.g. if a goal is "top-10%" then value is `10`.
   * @param {string} type Either '' or '%' to decide percent flag.
   */
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
      if ( goalval[0] == value && goalval[1] == type && goal.name() != 'theory') {
        errors.push("Value " + goal.name() + " already exists. Try another one.");
      }
    });

    if (errors.length > 0) {
      alert(errors.join('<br />'))
    }

    return errors.length == 0
  };

  /**
   * Update Experiment with data from server.
   * @params {Array} data Experiment data from server, grouped by different goals.
   */
  app.simulationAnalysis.updateExperiment = function(data) {
    app.vm.Experiment.goals().forEach(function(goal, i) {
      app.vm.Experiment.goals()[i].data = data[goal.name()];
      app.vm.CurrentDetail.goals()[i].success_rate(data[goal.name()][app.vm.CurrentDetail._rejection_phase()]);
    });
    app.vm.Experiment.processed(true);
  }

})();
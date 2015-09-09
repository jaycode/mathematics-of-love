var app = app || {};

(function(){
  app.detail = {
    slider: null
  };

  app.detail.view = function() {
    app.helpers.changePage('#main_viz-detail');
  }

  // Redraw plot in detail page based on rejection phase, lifetime, and goals stored in app.vm.CurrentDetail.
  app.detail.redrawPlot = function() {
    app.detailViz.draw(
      app.data.compatibilities,
      '#simulation_analysis-plot_area',
      {
        lifetime: app.data.currentDetail['lifetime'],
        rejection_phase: app.data.currentDetail['rejection_phase']
      });
  }

  app.DetailGoal = function(data) {
    var self = this;

    this.name = ko.computed(function() {
      var goal = app.data.experiment.goals[data['goal_id']];
      var matches = goal['name'].match(/[a-zA-Z0-9%]+/g);
      return matches.join(' ');
    }, this);
    this.getClass = ko.computed(function() {
      var colors = app.data.settings['colors'];
      var goal = app.data.experiment.goals[data['goal_id']];
      return colors[goal['color_id']]['class'];
    });
    this.success_rate = ko.observable(data['success_rate']);
    this.success_rate_percent = ko.computed(function() {
      return app.helpers.formatPercent(Math.round(self.success_rate()*10000) / 100);
    });
  }

  app.CurrentDetail = function(data) {
    var self = this;
    this.lifetime = ko.computed(function() {
      return app.helpers.formatThousandSeparators(data['lifetime']);
    }, this);
    this.total_candidates = ko.observable(data['total_candidates']);

    this.goals = ko.observableArray([]);
    data.goals.forEach(function(goal) {
      self.goals.push(new app.DetailGoal(goal));
    });

    // Use _lifetime (or other _varname) to access the numeric values directly,
    // but for other needs e.g. updating or display, use lifetime (or varname).
    this._lifetime = ko.observable(data['lifetime']);
    // read: Get value from model, turn 10000 to 10,000.
    // write: Turn 10,000 to 10000, set to model
    this.lifetime = ko.pureComputed({
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetime());
      },
      // Update people met when updating lifetime.
      write: function(value) {
        self._lifetime(app.helpers.parseNumberWithSeparators(value));

        // Find number of total candidates within this lifetime from compatibilities dataset.
        var nested = d3.nest()
          .key(function(d) {
            return d['lifetime'];
          })
          .rollup(function(leaves) {
            return {
              'total_candidates': leaves.length
            };
          })
          .entries(app.data.compatibilities);
        self.total_candidates(nested[self._lifetime()-1].values['total_candidates']);
      }
    });

    this._rejection_phase = ko.observable(data['rejection_phase'])
    this.rejection_phase = ko.computed({
      read: function() {
        return app.helpers.formatPercent(app.helpers.formatPercent(self._rejection_phase()));
      },

      // Update goals when updating rejection phase.
      write: function(value) {
        self._rejection_phase(value);

        // Find goal data from experiment dataset.
        var goals = app.data.experiment.goals;
        goals.forEach(function(goal, i) {
          self.goals()[i].success_rate(goal.data[value]);
        });
      }
    });

    this.window_top = ko.observable(data['window_top']);
    this.window_left = ko.observable(data['window_left']);

    this.closeDetailWindow = function() {
      d3.select('#detail_window')
        .transition()
        .style('opacity', 0)
        .each('end', function() {
          d3.select(this)
            .style('opacity', 1)
            .classed('show-block', false);
        });
      d3.selectAll('#g-sa .hidden_circles circle')
        .classed('active', false)
        .transition()
        .attr('r', 0);
    };

    this.showPhaseSlider = function(vm, e) {
      app.detail.showPhaseSlider(vm, e);
    };

    this.nextRandomLifetime = function() {
      app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment.lifetimes()));
    };
    this.showLifetimeSlider = function(vm, e) {
      app.detail.showLifetimeSlider(vm, e);
    };

    this.lifetimeNext = function() {
      
    };
    this.lifetimePrev = function() {
      
    };
  }

  // -------------------
  // Details of methods
  // -------------------

  app.detail.showPhaseSlider = function(vm, e) {
    // Create vertical slider.
    this.slider = this.slider || this.createVSlider(vm, e);

    // Activate vertical slider.
    d3.select('#active_slider > div')
      .call(
        d3.slider()
          .value(
            app.vm.CurrentDetail.rejection_phase()
          )
          .orientation("vertical")
          .on('slide', function(evt, value) {
            app.vm.CurrentDetail.rejection_phase(parseInt(value));
          })
          .on('slideend', function(evt, value) {
            // Refresh detail plot.
            app.detail.redrawPlot();
          })
      );
  }

  app.detail.showLifetimeSlider = function(vm, e) {
    // Create vertical slider.
    this.slider = this.slider || this.createVSlider(vm, e);
    this.slider.style('top', (e.pageY-100) + 'px');

    // Activate vertical slider.
    d3.select('#active_slider > div')
      .attr('class', 'lifetime_slider')
      .call(
        d3.slider()
          .orientation("vertical")
          .min(1)
          .max(app.data.experiment['lifetimes'])
          .value(
            app.vm.CurrentDetail.lifetime()
          )
          .on('slide', function(evt, value) {
            app.vm.CurrentDetail.lifetime(value);
          })
          .on('slideend', function(evt, value) {
            // Refresh detail plot.
            app.detail.redrawPlot();
          })
      );
  }

  // Private functions.
  app.detail.createVSlider = function(vm, e) {
    var self = this;

    // Create an invisible layer covering the entire screen
    // that will remove slider when clicked.
    var invisible = d3.select('body')
      .append('div')
      .attr('class', 'invisible_layer')
      .on('click', function() {
        this.remove();
        self.slider.remove();
        self.slider = null;
      });

    // Create vertical slider at clicked pos.
    var slider = d3.select('body')
      .append('div')
      .attr('id', 'active_slider')
      .attr('class', 'slider-box')
      .style('left', e.pageX + 'px')
      .style('top', (e.pageY-50) + 'px')

    d3.select('#active_slider')
      .append('div')
    return slider;
  }
})();
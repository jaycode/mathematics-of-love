var app = app || {};

(function(){
  app.detail = {
    slider: null
  };

  app.detail.view = function(callback) {
    var self = this;
    // Dont run this with observable i.e. app.vm.CurrentDetail.activeGoal().setActive();
    // since that would cause the page redrawn multiple times since setActive method
    // runs redrawExeriment, while redrawPlot also runs it.
    app.helpers.changePage('#main_viz-detail', function() {
      app.detail.redrawPlot(callback);
    });
  }

  // Redraw plot in detail page based on rejection phase, lifetime, and goals stored in app.vm.CurrentDetail.
  app.detail.redrawPlot = function(callback) {
    d3.select('#detail-plot_area').selectAll('*').transition();
    var plotAreaSelector = '#detail-plot_area';
    d3.select(plotAreaSelector).html('');

    var parsedGoal = app.helpers.parseGoal(app.vm.CurrentDetail.activeGoal().name());

    app.detailViz.draw(
      app.data.currentDetail.candidates,
      plotAreaSelector,
      {
        lifetime: app.vm.CurrentDetail._lifetime(),
        topX: parsedGoal[0],
        percent: parsedGoal[1],
        rejectionPhase: app.vm.CurrentDetail._rejection_phase(),
        callback: callback
      });
  }

  app.detail.redrawRejectionPhase = function() {
    d3.select('#detail-plot_area').selectAll('*').transition();
    app.detailViz.rejectionPhase = app.vm.CurrentDetail._rejection_phase();
    app.detailViz.drawRejectionPhase(function() {
      app.detailViz.drawExperiment();
    });
  }

  // Redraw experiment results in detail page based on data stored in app.vm.CurrentDetail.
  app.detail.redrawExperiment = function() {
    d3.select('#detail-plot_area').selectAll('*').transition();
    app.detailViz.drawExperiment();
  }


  app.DetailGoal = function(vm, data) {
    var self = this;

    this.id = ko.observable(data['goal_id']);
    this.idClass = ko.computed(function() {
      return "goal-"+self.id();
    });
    this.name = ko.computed(function() {
      var goal = vm.Experiment.goals()[data['goal_id']];
      var matches = goal.name().match(/[a-zA-Z0-9%]+/g);
      return matches.join(' ');
    }, this);
    this.getClass = ko.computed(function() {
      var colors = app.data.settings['colors'];
      var goal = vm.Experiment.goals()[data['goal_id']];
      return colors[goal.color_id()]['class'];
    });
    this.success_rate = ko.observable(data['success_rate']);
    this.success_rate_percent = ko.computed(function() {
      return app.helpers.formatPercent(Math.round(self.success_rate()*10000) / 100);
    });

    this.active = ko.observable(data['active']);
    this.getClassAndActiveStatus = ko.computed(function() {
      var class1 = self.getClass();
      var class2 = self.active() ? '_is_active' : '';
      var combined = [class1, class2].join('');
      return combined;
    });

    this.setActive = function() {
      // var name = e.target.textContent;
      // var detailGoal = _.find(app.vm.CurrentDetail.goals(), function(o) {return o.name() == name;});
      app.vm.CurrentDetail.goals().forEach(function(dg) {
        dg.active(false);
      });
      self.active(true);
      var parsedGoal = app.helpers.parseGoal(self.name());
      app.detailViz.topX = parsedGoal[0];
      app.detailViz.percent = parsedGoal[1];
      app.detailViz.drawOptimals();
    };
  }

  app.CurrentDetail = function(vm, data) {
    var self = this;
    this.lifetime = ko.computed(function() {
      return app.helpers.formatThousandSeparators(data['lifetime']);
    }, this);
    this.total_candidates = ko.observable(data['total_candidates']);

    this.goals = ko.observableArray([]);
    data.goals.forEach(function(goal) {
      self.goals.push(new app.DetailGoal(vm, goal));
    });
    this.activeGoal = function() {
      var active = _.find(self.goals(), function(g) {return g.active();});
      return active;
    };

    // Use _lifetime (or other _varname) to access the numeric values directly,
    // but for other needs e.g. updating or display, use lifetime (or varname).
    this._lifetime = ko.observable(data['lifetime']);

    // read: Get value from model, turn 10000 to 10,000.
    // write: Turn 10,000 to 10000, set to model
    this.lifetime = ko.pureComputed({
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetime());
      },
      // Update compatibilities and total candidates when updating lifetime.
      write: function(value) {
        self._lifetime(app.helpers.parseNumberWithSeparators(value));

        var nested = app.helpers.groupCompatibilitiesByLifetime(app.data.compatibilities);
        var group = nested[self._lifetime()-1];
        self.total_candidates(group.values['total_candidates']);
        var candidates = group.values['candidates'];
        app.data.currentDetail.candidates = candidates;
      }
    });

    // Used in html that, when changed, also redraw plot.
    this.displayedLifetime = ko.pureComputed({
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetime());
      },
      // Update compatibilities and total candidates when updating lifetime.
      write: function(value) {
        self.lifetime(app.helpers.parseNumberWithSeparators(value));
        app.detail.redrawPlot();
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
        var goals = app.vm.Experiment.goals();
        goals.forEach(function(goal, i) {
          self.goals()[i].success_rate(goal.data[value]);
        });
        app.detail.redrawRejectionPhase();
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
      app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment._lifetimes()));
      app.detail.redrawPlot();
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
    this.slider.type = 'phase';

    // Activate vertical slider.
    d3.select('#active_slider > div')
      .call(
        d3.slider()
          .value(
            app.vm.CurrentDetail._rejection_phase()
          )
          .orientation("vertical")
          .min(1)
          .max(100)
          .on('slide', function(evt, value) {
            app.vm.CurrentDetail.rejection_phase(parseInt(value));
          })
      );
  }

  app.detail.showLifetimeSlider = function(vm, e) {
    // Create vertical slider.
    this.slider = this.slider || this.createVSlider(vm, e);
    this.slider.style('top', (e.pageY-100) + 'px');
    this.slider.type = 'lifetime';

    // Activate vertical slider.
    d3.select('#active_slider > div')
      .attr('class', 'lifetime_slider')
      .call(
        d3.slider()
          .orientation("vertical")
          .min(1)
          .max(app.vm.Experiment._lifetimes())
          .value(
            app.vm.CurrentDetail.lifetime()
          )
          .on('slide', function(evt, value) {
            app.vm.CurrentDetail.lifetime(value);
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
        if (self.slider.type == 'lifetime') {
          app.detail.redrawPlot();
        }
        else {
          app.detail.redrawRejectionPhase();
        }
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
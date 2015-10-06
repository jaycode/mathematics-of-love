var app = app || {};

(function(){
  /**
   * Module that contains everything related to details page, the page
   * presenting {@link app.detailViz Detail Visualization}. The ViewModel controlling this page
   * is {@link app.CurrentDetail} ViewModel.
   * ## Related Links
   * - {@link app.CurrentDetail}
   * - {@link app.detailViz}
   * @namespace app.detail
   */
  app.detail = {
    /**
     * Pointer to slider object displayed for adjusting
     * {@link app.detail.showLifetimeSlider lifetime} and 
     * {@link app.detail.showPhaseSlider phase}.
     * @protected
     * @type {d3.slider|null}
     * @memberOf app.detail
     */
    slider: null
  };

  /**
   * Changes currently displayed page to current detail page. <br />
   * Dont run this with observable i.e. `app.vm.CurrentDetail.activeGoal().setActive();`<br />
   * as that would cause the page to be drawn multiple times since both <br />
   * {@link app.DetailGoal#setActive setActive} and {@link app.detail.redrawPlot redrawPlot} methods
   * both make a call to {@link redrawExperiment} method.
   */
  app.detail.view = function(callback) {
    var self = this;
    app.helpers.changePage('#main_viz-detail', function() {
      app.detail.redrawPlot(callback);
    });
  }

  /**
   * Redraw plot in detail page based on rejection phase, lifetime, and goals
   * stored in {@link app.CurrentDetail app.vm.CurrentDetail}.
   */
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

  /**
   * Redraw only the rejection phase area in {@link app.detailViz}.
   */
  app.detail.redrawRejectionPhase = function() {
    d3.select('#detail-plot_area').selectAll('*').transition();
    app.detailViz.rejectionPhase = app.vm.CurrentDetail._rejection_phase();
    app.detailViz.drawRejectionPhase(function() {
      app.detailViz.drawExperiment();
    });
  }

  /**
   * Redraw experiment results in detail page based on data stored in {@link app.CurrentDetail app.vm.CurrentDetail}.
   */
  app.detail.redrawExperiment = function() {
    d3.select('#detail-plot_area').selectAll('*').transition();
    app.detailViz.drawExperiment();
  }


  /**
   * ViewModel for goals displayed in current detail page.
   * Instances are stored in array {@link app.CurrentDetail.goals app.vm.CurrentDetail.goals}.
   * ## Related Links
   * - {@link app.CurrentDetail}
   * - {@link app.data.currentDetail}
   * - {@link app.detail}
   * @params {app.ViewModel} vm the app's main ViewModel.
   * @params {app.data.currentDetail.goals} data Setup data for detail goal.
   * @class app.DetailGoal
   */
  app.DetailGoal = function(vm, data) {
    var self = this;

    /**
     * Observed {@link app.data.currentDetail.goals.goal.goal_id goal id}.
     * @type {ko.observable}
     * @return {integer}
     */
    this.id = ko.observable(data['goal_id']);

    /**
     * Used to return class name used in HTML.
     * Class name follows this naming convention: "goal-[id]".
     * @type {ko.computed}
     * @return {string}
     */
    this.idClass = ko.computed(function() {
      return "goal-"+self.id();
    });

    /**
     * Returns pretty name of a goal e.g. "Top 10%" instead of "top-10%"
     * @type {ko.computed}
     * @return {string|null}
     */
    this.name = ko.computed(function() {
      var goal = _.find(vm.Experiment.goals(), function(g) {return g.id() == self.id()});
      if (typeof(goal) != 'undefined') {
        var matches = goal.name().match(/[a-zA-Z0-9%]+/g);
        return matches.join(' ');
      }
    }, this);

    /**
     * Returns class name used for goal related elements (box and lines).
     * @type {ko.computed}
     * @return {string|null}
     */
    this.getClass = ko.computed(function() {
      var colors = app.data.settings['colors'];
      var goal = _.find(vm.Experiment.goals(), function(g) {return g.id() == self.id()});
      if (typeof(goal) != 'undefined') {
        return colors[goal.color_id()]['class'];
      }
    });

    /**
     * Observed {@link app.data.currentDetail.goals.goal.success_rate success rate}.
     * @type {ko.observable}
     * @return {float}
     */
    this.success_rate = ko.observable(data['success_rate']);

    /**
     * Returns success rate + percent symbol formatted using {@link app.helpers.formatPercent} method.
     * @type {ko.computed}
     * @return {string}
     */
    this.success_rate_percent = ko.computed(function() {
      return app.helpers.formatPercent(Math.round(self.success_rate()*10000) / 100);
    });

    /**
     * Observed {@link app.data.currentDetail.goals.goal.active active status}.
     * @type {ko.observable}
     * @return {boolean}
     */
    this.active = ko.observable(data['active']);

    /**
     * Returns class to be displayed in goal boxes.<br />
     * Returned values for examples are "goal-1", "goal-2_is_active".
     * @type {ko.computed}
     * @return {string}
     */
    this.getClassAndActiveStatus = ko.computed(function() {
      var class1 = self.getClass();
      var class2 = self.active() ? '_is_active' : '';
      var combined = [class1, class2].join('');
      return combined;
    });

    /**
     * Activate a DetailGoal, then {@link app.detailViz.drawOptimals recolor the bars in detail visualization}.
     */
    this.setActive = function() {
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

  /**
   * ViewModel that relates to {@link app.detail detail page}, where single lifetimes are simulated.<br />
   * This ViewModel also relates to current detail window displayed in {@link app.mainViz}.<br />
   * This is initialized in {@link app.data.currentDetail}.<br />
   * Singleton instance is available as `app.vm.CurrentDetail`.
   * ## Related Links
   * - {@link app.detail}
   * - {@link app.data.currentDetail}
   * @params {app.ViewModel} vm the app's main ViewModel.
   * @params {app.data.currentDetail} data Setup data for current detail.
   * @class app.CurrentDetail
   */
  app.CurrentDetail = function(vm, data) {
    var self = this;

    /**
     * Returns lifetime thousand separated with method {@link app.helpers.formatThousandSeparators}.
     * @return {string}
     * @deprecated
     */
    // this.lifetime = ko.computed(function() {
    //   return app.helpers.formatThousandSeparators(data['lifetime']);
    // }, this);

    /**
     * Observes {@link app.data.currentDetail.total_candidates total candidates}.
     * @type {ko.observable}
     * @return {number}
     */
    this.total_candidates = ko.observable(data['total_candidates']);

    /**
     * ObservableArray of a list of {@link app.DetailGoal} ViewModels.
     * @type {ko.observableArray}
     * @return {Array.<app.DetailGoal>}
     */
    this.goals = ko.observableArray([]);
    data.goals.forEach(function(goal) {
      self.goals.push(new app.DetailGoal(vm, goal));
    });

    /**
     * Returns currently active goal.
     * @return {app.DetailGoal}
     */
    this.activeGoal = function() {
      var active = _.find(self.goals(), function(g) {return g.active();});
      return active;
    };

    /**
     * Observed {@link app.data.currentDetail.lifetime}.<br />
     * Use `_lifetime` (or other `_varname`) method to access the numeric values directly,
     * but for other needs e.g. updating or display, use `lifetime` (or `varname`) method.
     * @type {ko.observable}
     * @return {number}
     */
    this._lifetime = ko.observable(data['lifetime']);

    /**
     * Computed class to read and write to {@link app.CurrentDetail CurrentDetail} ModelView's lifetime
     * property.<br />
     * read: Get value from model, turn 10000 to 10,000.<br />
     * write: Turn 10,000 to 10000, set to model
     * @type {ko.pureComputed}
     * @namespace app.CurrentDetail#lifetime
     */
    this.lifetime = ko.pureComputed({
      /**
       * Returns thousand separated {@link app.CurrentDetail#_lifetime}.
       * @return {string}
       * @memberOf app.CurrentDetail#lifetime
       */
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetime());
      },
      /**
       * Update compatibilities and total candidates when updating lifetime.
       * @memberOf app.CurrentDetail#lifetime
       */
      write: function(value) {
        self._lifetime(app.helpers.parseNumberWithSeparators(value));

        var nested = app.helpers.groupCompatibilitiesByLifetime(app.data.compatibilities);
        var group = nested[self._lifetime()-1];
        self.total_candidates(group.values['total_candidates']);
        var candidates = group.values['candidates'];
        app.data.currentDetail.candidates = candidates;
      }
    });

    /**
     * Used in html that, when inputs updated, also redraw plot.<br />
     * This is used specifically in Current Detail page.
     * @type {ko.pureComputed}
     * @namespace app.CurrentDetail#displayedLifetime
     */
    this.displayedLifetime = ko.pureComputed({
      /**
       * Returns thousand separated {@link app.CurrentDetail#_lifetime}.
       * @return {string}
       * @memberOf app.CurrentDetail#displayedLifetime
       */
      read: function() {
        return app.helpers.formatThousandSeparators(self._lifetime());
      },
      /**
       * Redraw {@link app.detailViz detail plot} after updated the lifetime.
       * @memberOf app.CurrentDetail#displayedLifetime
       */
      write: function(value) {
        self.lifetime(app.helpers.parseNumberWithSeparators(value));
        app.detail.redrawPlot();
      }
    });

    /**
     * Observable {@link app.data.currentDetail.rejection_phase rejection phase}.
     * @type {ko.observable}
     * @return {integer}
     */
    this._rejection_phase = ko.observable(data['rejection_phase'])

    /**
     * Computed rejection phase. Use this to display in html and write from html input.<br />
     * Name uses underscore to match {@link app.data.currentDetail.rejection_phase}.
     * @type {ko.computed}
     * @namespace app.CurrentDetail#rejection_phase
     */
    this.rejection_phase = ko.computed({
      /**
       * Returns percent formatted rejection phase.
       * @return {string}
       * @memberOf app.CurrentDetail#rejection_phase
       */
      read: function() {
        return app.helpers.formatPercent(app.helpers.formatPercent(self._rejection_phase()));
      },

      /**
       * Update goals when updating rejection phase.
       * @memberOf app.CurrentDetail#rejection_phase
       */
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

    /**
     * Observed {@link app.data.currentDetail.window_top}, for top position of displayed CurrentDetail
     * window in Simulation Analysis page. Returns string like "100px".
     * @type {ko.observable}
     * @return {string}
     */
    this.window_top = ko.observable(data['window_top']);
    /**
     * Observed {@link app.data.currentDetail.window_left}, for left position of displayed CurrentDetail
     * window in Simulation Analysis page. Returns string like "100px".
     * @type {ko.observable}
     * @return {string}
     */
    this.window_left = ko.observable(data['window_left']);

    /**
     * Hides DetailWindow in Simulation Analysis page.
     */
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
        .style('opacity', 0);
    };

    /**
     * Alias for {@app.detail.showPhaseSlider}
     */
    this.showPhaseSlider = function(vm, e) {
      app.detail.showPhaseSlider(vm, e);
    };

    /**
     * Picks next random lifetime, then redraw {@link app.detailViz}.
     */
    this.nextRandomLifetime = function() {
      app.vm.CurrentDetail.lifetime(_.random(1, app.vm.Experiment._lifetimes()));
      app.detail.redrawPlot();
    };

    /**
     * Alias for {@app.detail.showLifetimeSlider}
     */
    this.showLifetimeSlider = function(vm, e) {
      app.detail.showLifetimeSlider(vm, e);
    };
  }

  // -------------------
  // Details of methods
  // -------------------

  /**
   * Shows phase slider.
   * @param {app.CurrentDetail} vm
   * @param {event} e mouse event that contains `pageX` and `pageY`
   *   to find element position.
   */
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
          .min(0)
          .max(99)
          .on('slide', function(evt, value) {
            app.vm.CurrentDetail.rejection_phase(parseInt(value));
          })
      );
  }

  /**
   * Shows lifetime slider.
   * @param {app.CurrentDetail} vm
   * @param {event} e mouse event that contains `pageX` and `pageY`
   *   to find element position.
   */
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

  /**
   * Creates a vertical slider
   * @private
   */
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
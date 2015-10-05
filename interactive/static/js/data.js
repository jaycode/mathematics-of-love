var app = app || {};

(function(){
  /**
   * This object contains all data used in this app.
   * @namespace app.data
   */
  app.data = {};

  /**
   * Last url used to get data. Used in app.Generate
   * to decide whether to make a request to server.
   */
  app.data.last_url = '';

  /**
   * List of compatibilities gathered from server.
   */
  app.data.compatibilities = [];

  /**
   * Various settings used in the app.
   * @namespace app.data.settings
   */
  app.data.settings = {
    /**
     * Minimum Age difference user can enter.
     */
    min_age_diff: 1,    
    /**
     * Maximum Age difference user can enter. This needs to be set since
     * too large age diff may cause server breakdown.
     */
    max_age_diff: 20,
    /**
     * Minimum # of lifetimes user can simulate.
     */
    min_lifetimes: 1,
    /**
     * Maximum # of lifetimes user can simulate.
     */
    max_lifetimes: 2000,
    /**
     * Minimum rejection phase (0%).
     */
    min_rejection_phase: 0,
    /**
     * Maximum rejection phase (99%).
     */
    max_rejection_phase: 99,
    /**
     * Maximum number of goals the app can contain (7, or 8 plus theory goal).
     */
    max_goals: 7,
    /**
     * Minimum number of potential partners per year user can enter.
     */
    min_potential_partners: 0,
    /**
     * Maximum number of potential partners per year user can enter.
     */
    max_potential_partners: 50,
    /**
     * CSS classes used in colors.<br />
     * {class: 'color-theory'} is a default class, don't delete it.<br />
     * Order position (base-0) is used in {@link app.data.experiment.goals.goal.color_id}.
     * @type {Array.Object<{class: {string}}>}
     */
    colors: [
      {
        class: 'color-theory'
      },
      {
        class: 'color1'
      },
      {
        class: 'color2',
      },
      {
        class: 'color3'
      },
      {
        class: 'color4'
      },
      {
        class: 'color5'
      },
      {
        class: 'color6'
      },
      {
        class: 'color7',
      },
      {
        class: 'color8'
      },
      {
        class: 'color9'
      },
      {
        class: 'color10'
      }
    ]
  };

  /**
   * Variables used in generator page.<br />
   * An object consists of lifetimes, a1, a2, p1, p2.<br />
   * a for age, p for potential partners per year.
   * ## Related Links
   * - {@link app.Generator}
   * - {@link app.generate}
   * @namespace app.data.generator
   */
  app.data.generator = {
    /**
     * Number of lifetimes to simulate.
     */
    lifetimes: 1000,
    /**
     * Dating start age. The app will generate random number of candidates from dating start to dating end age.
     */
    a1: 18,
    /**
     * Dating end age. The app will generate random number of candidates from dating start to dating end age.
     */
    a2: 24,
    /**
     * Minimum potential partners per year. Generated random number of candidates will have this minimum number.
     */
    p1: 0,
    /**
     * Maximum potential partners per year. Generated random number of candidates will have this maximum number.
     */
    p2: 8
  };

  /**
   * Data used in experiment page (i.e. the current experiment).
   * @namespace app.data.experiment
   */
  app.data.experiment = {
    /**
     * Number of lifetimes currently being experimented.<br />
     * Beside used in calculation, another place where it is used is in
     * {@link app.data.currentDetail.lifetime} as the maximum
     * lifetime user can set.
     */
    lifetimes: 1000,
    /**
     * Start age in current experiment.
     */
    a1: 18,
    /**
     * End age in current experiment.
     */
    a2: 24,
    /**
     * Minimum number of potential partners in current experiment.
     */
    p1: 0,
    /**
     * Maximum number of potential partners in current experiment.
     */
    p2: 8,

    /**
     * If processed is true, do not process again.<br />
     * Set processed to false when generating new compatibilities
     * i.e. {@link app.generate.generateDataset}.
     */
    processed: false,
    
    /**
     * Goal objects used in Experiment page. The variables here map to 
     * goals displayed in the page (e.g. their names, active status, etc.)
     * @type {Array.Object}
     * @namespace app.data.experiment.goals
     */
    goals: [
      /**
       * Goal object. The values here are used to initialize parameters used in
       * {@link app.Goal Goal ViewModel} that's actually used in the app.
       * @namespace app.data.experiment.goals.goal
       */
      {
        /**
         * id is needed, we cannot just use goal order since that way when deleted it changes.
         * @memberOf app.data.experiment.goals.goal
         */
        id: 0,

        /**
         * Name of a goal. Pass this to {@link app.helpers.parseGoal} to get its values.
         * @type {string}
         * @memberOf app.data.experiment.goals.goal
         */
        name: 'top-1',

        /**
         * If active is true, display the goal in Simulation Analysis graph.
         * @type {boolean}
         * @memberOf app.data.experiment.goals.goal
         */
        active: true,

        /**
         * id / Ordering position of {@link app.data.settings.colors}.
         * @memberOf app.data.experiment.goals.goal
         */
        color_id: 1,

        /**
         * If true then this goal can be removed.
         * @type {boolean}
         * @memberOf app.data.experiment.goals.goal
         */
        destructible: true,
        /**
         * Data stored for a goal (list of success rate and rejection phase)
         * @type {Array.Object<{success_rate: float, rejection_phase: integer}>}
         * @memberOf app.data.experiment.goals.goal
         */
        data: [
        ]
      },
      {
        id: 1,
        name: 'top-5%',
        active: true,
        color_id: 2,
        destructible: true,
        data: []
      },
      {
        id: 2,
        name: 'top-15%',
        active: true,
        color_id: 3,
        destructible: true,
        data: []
      },
      {
        id: 3,
        name: 'theory',
        active: true,
        color_id: 0,
        destructible: false,
        data: []
      }
    ]
  };

  /**
   * Data used in {@link app.CurrentDetail} ViewModel
   * @namespace app.data.currentDetail
   */
  app.data.currentDetail = {
    /**
     * Size of rejection phase used in a simulation within current detail page (0 - 99%).
     * @type integer
     */
    rejection_phase: 37,
    
    /**
     * Lifetime used in a simulation within current detail page (0 - {@link app.data.experiment.lifetimes}).<br />
     * Will be set at random after generated, to adjust initial value set it after data generation.
     */
    lifetime: 0,

    /**
     * Total number of candidates of this simulation (i.e. total number of potential partners
     * generated at random throughout one lifetime).
     */
    total_candidates: 30,

    /**
     * Compatibilities data of current experiment, used in {@link app.detailViz}.
     */
    compatibilities: [],

    /**
     * Top position of Current Detail window in {@link app.mainViz} (Simulation Analysis page).
     */
    window_top: '100px',

    /**
     * Top position of Current Detail window in {@link app.mainViz} (Simulation Analysis page).
     */
    window_left: '100px',

    /**
     * Data for list of {@link app.CurrentGoal Goal ViewModels} displayed in Current Detail page.
     * @namespace app.data.currentDetail.goals
     */
    goals: [
      /**
       * Goal object for {@link to app.CurrentDetail} ViewModel.
       * @namespace app.data.currentDetail.goals.goal
       */
      {
        /**
         * Goal id, referenced from {@link app.data.experiment.goals.goal.id}.
         * @memberOf app.data.currentDetail.goals.goal
         */
        goal_id: 0,
        /**
         * Success rate of this goal.
         * @type {float}
         * @memberOf app.data.currentDetail.goals.goal
         */
        success_rate: .35,
        /**
         * Set the goal to be shown in current detail page.
         * @type {boolean}
         * @memberOf app.data.currentDetail.goals.goal
         */
        active: false
      },
      {
        goal_id: 1,
        success_rate: .40,
        active: false
      },
      {
        goal_id: 2,
        success_rate: .45,
        active: false
      },
      {
        goal_id: 3,
        success_rate: .37123,
        active: true
      }
    ]
  };
})();
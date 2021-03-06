// All project's data.
var app = app || {};

(function(){
  app.data = {};

  // Last url used to get data.
  app.data.last_url = '';

  // List of compatibilities gathered from server.
  app.data.compatibilities = [];

  app.data.settings = {
    min_age_diff: 1,
    max_age_diff: 20,
    min_lifetimes: 1,
    max_lifetimes: 2000,
    min_rejection_phase: 0,
    max_rejection_phase: 99,
    max_goals: 7,
    min_potential_partners: 0,
    max_potential_partners: 50,
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

  app.data.generator = {
    lifetimes: 1000,
    a1: 18,
    a2: 24,
    p1: 0,
    p2: 8
  };

  app.data.experiment = {
    lifetimes: 1000,
    a1: 18,
    a2: 24,
    p1: 0,
    p2: 8,

    // If processed is true, do not process again.
    // Set processed to false when generating new compatibilities
    // i.e. app.generate.generateDataset().
    processed: false,
    
    goals: [
      {
        id: 0, // id is needed, we cannot just use goal order since that way when deleted it changes.
        name: 'top-1',
        active: true,
        color_id: 1,
        destructible: true,
        data: [
          // Keep the data here in format {success_rate: %f, rejection_phase: %i}
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

  app.data.currentDetail = {
    rejection_phase: 37,
    lifetime: 0, // Will be set at random after generated, to adjust initial value set it after data generation.
    total_candidates: 30,

    // Compatibilities data of current detail, used in detail plot.
    compatibilities: [],

    // window top and left position in main viz.
    window_top: '100px',
    window_left: '100px',

    goals: [
      {
        goal_id: 0,
        success_rate: .35,
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
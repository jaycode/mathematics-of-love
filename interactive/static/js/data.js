// All project's data.
var app = app || {};

(function(){
  app.data = {};

  // Last url used to get data.
  app.data.last_url = '';

  // List of compatibilities gathered from server.
  app.data.compatibilities = [];

  app.data.settings = {
    min_age: 10,
    max_age: 90,
    min_lifetimes: 1,
    max_lifetimes: 10000,
    min_rejection_phase: 0,
    max_rejection_phase: 99,
    max_goals: 11,
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
        name: 'top-1',
        active: true,
        color_id: 1,
        destructible: false,
        data: [
          // Keep the data here in format {success_rate: %f, rejection_phase: %i}
        ]
      },
      {
        name: 'top-5%',
        active: true,
        color_id: 2,
        destructible: true,
        data: []
      },
      {
        name: 'top-15%',
        active: true,
        color_id: 3,
        destructible: true,
        data: []
      },
      {
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
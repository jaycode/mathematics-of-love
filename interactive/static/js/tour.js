// Tour object
var app = app || {};

(function() {
  app.getTourSettings = function() {
    return {
      // debug: true,
      storage: false,
      orphan: true,
      steps: [
        {
          orphan: true,
          title: 'Introduction to Optimal Stopping Theory',
          content: 'This is a simulation of what is likely to happen when we ' +
          'apply optimal stopping theory to choose from a set of candidates.<br />' +
          'Let\'s assume following simple dating rules: ' +
          '<ol>'+
            '<li>Once you decide to settle down, you can\'t change to other future partners remaining on your list.</li>' +
            '<li>Equally, once you reject someone, you can\'t go back and change your mind at a later date.</li>' +
          '</ol>'
        },
        {
          element: '#detail-rp',
          title: 'Rejection Phase',
          content: 'In here, we use the magic number 37% as our Rejection Phase, which means...'
        },
        {
          element: '#r_phase',
          title: 'Reject 37% candidates',
          content: 'First we reject 37% of all candidates and take note of their compatibility scores.'
        },
        {
          element: '.marker.chosen',
          title: 'Choose the next better candidate',
          content: 'Then at the end of that rejection period, pick the first candidate who is better than ' +
          'the rest we have rejected.',
          onShown: function(tour) {
            tour.slightlyRight();
          },
          onNext: function(tour) {
            app.vm.CurrentDetail.lifetime(422);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          }
        },
        {
          element: '.marker.top',
          title: 'Where things could go wrong (1)',
          content: "Of course, it's well possible that we may meet the best candidate during our rejection phase. " +
          "And since the strategy requires us to reject them, we will then end up not finding anyone better, grow old and die alone, " +
          "probably nursing a deep hatred towards Mathematical equations.",
          onShown: function(tour) {
            tour.slightlyRight();
          },
          onNext: function(tour) {
            app.vm.CurrentDetail.lifetime(430);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          },
          onPrev: function(tour) {
            app.vm.CurrentDetail.lifetime(165);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          }
        },
        {
          element: '.marker.chosen',
          title: 'Where things could go wrong (2)',
          placement: 'top',
          content: "On the other hand, it is quite possible too that during our rejection phase we may have only a streak of awful dates, " +
          "and the person right after that rejection phase is just marginally better. According to the strategy, again, we would have " +
          "to pick this person and end up with a suboptimal marriage.",
          onShown: function(tour) {
            $('.popover').css('left', parseFloat($('.popover').css('left'))-180);
            $('.popover').css('top', parseFloat($('.popover').css('top'))-5);
          },
          onPrev: function(tour) {
            app.vm.CurrentDetail.lifetime(422);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          }
        },
        {
          element: '.goal_section.goal-3',
          title: "Success Rate",
          content: "As described in the introduction graph earlier above, using purely Mathematical calculation, we get 37.1% chance " +
          "of success.",
          onShown: function(tour) {
            for (var i=0;i<3;i++) {
              d3.select('.goal_section.goal-'+i)
                .style('opacity', 1)
                .transition()
                .style('opacity', 0);
            }
          },
          onHide: function(tour) {
            for (var i=0;i<3;i++) {
              d3.select('.goal_section.goal-'+i)
                .style('opacity', 0)
                .transition()
                .style('opacity', 1);
            }
          },
          onNext: function(tour) {
            app.generated.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          }
        },
        {
          // element: '#sa-view_generated_dataset',
          orphan: true,
          title: "A bigger picture",
          content: "Let's now see a bigger picture of this experiment. We have here a randomly generated dataset of 1,000 lifetimes, each with " +
          "different number of candidates and compatibility scores. You can see the details and distribution of generated dataset in this page.",
          onPrev: function(tour) {
            app.detail.view(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          }
        },
        {
          element: '#generated-p2',
          title: "Dating Period and Yearly Potential Partners.",
          content: "In our dataset, we set some rule for data generation. In this example, we consider a person who is dating from age "+
          app.vm.Experiment.a1()+" to "+app.vm.Experiment.a2()+" and dating "+app.vm.Experiment.p1()+" to "+app.vm.Experiment.p2() +
          " candidates each year (which is a really low estimate according to <a href='http://www.femalefirst.co.uk/relationships/Women+Date+24+Men+A+Year-268977.html' target='_blank' rel='nofollow'>this research</a>).",
          onShown: function(tour) {
            d3.select('#generated-dating_period')
              .style('text-decoration', 'underline');
            d3.select('#generated-potential_partners')
              .style('text-decoration', 'underline');
          },
          onHide: function(tour) {
            d3.select('#generated-dating_period')
              .style('text-decoration', 'inherit');
            d3.select('#generated-potential_partners')
              .style('text-decoration', 'inherit');
          }
        },
        {
          element: '#generated-plot_area',
          placement: 'top',
          title: "Distribution of our Dataset",
          content: "Below graphs show the distribution of number and scores of candidates throughout lifetimes, which means how many lifetimes have how many " +
          "candidates and how big the average scores of these candidates. To make it a little more realistic I set it up with normal distribution (" +
          "i.e. most of the values are in the middle), since we don't really meet psycopaths or A-class single rockstars (or cool scientists, if thats' your thing) everyday.",
          onNext: function(tour) {
            app.simulationAnalysis.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          }
        },
        {
          orphan: true,
          title: "Analyzing our simulation results",
          content: "By repeating the simulation we did previously over our dataset and taking notes on our results, we get the following graph.",
          onShown: function(tour) {
            $('.popover').css('top', parseFloat($('.popover').css('top'))+80);
          },
          onPrev: function(tour) {
            app.generated.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          }
        },
        {
          element: '.add_goal',
          title: "Busting the magic number 37%",
          content: "See that 37% is not all too magical when we relax our criteria to 15%. Instead the magic seems to happen at around 23% rejection phase.",
          onShown: function(tour) {
            $('.popover').css('top', parseFloat($('.popover').css('top'))+180);
          },
        },
        {
          element: '.add_goal',
          title: "Pattern found in the dataset",
          content: "To me, what is more interesting in this graph is how the Mathematical equation can quite closely predict the pattern of the " +
          "dataset. Imagine that, <b>a set of randomly generated numbers</b> can be guessed in close accuracy using a single equation.<br />" +
          "Imagine the usefulness of this in other fields, for example in predicting the right portfolio to pick in Finance, or finding out the rate of " +
          "production failures in Aircraft jet engine factories."
        },
        {
          orphan: true,
          title: "Now Explore!",
          content: "Hopefully this brief introduction helped you to understand how Optimal Stopping Theory works for this particular problem.<br />" +
          "Now that you know where things are, you can tailor this experiment to your personal scenario and planning.<br />" +
          'Click on "Generate Different Dataset" link and create your own experiment. Here are some ideas:' +
          '<ul><li>You may notice that our "Top 1" and "Top 5%" results are exactly the same.' +
          " That was caused by the lacking number of people met per year, that made 5% of all candidates less than 1 person. You can try higher " +
          " numbers here.</li>"+
          "<li>What's your dating strategy? How many people are you planning / likely to meet each year? You can adjust that to see how it affects " +
          "your success rate.</li>"+
          "<li>Try out with a larger number of lifetimes, say 10,000. See how that will make the pattern more prominent.</li>" +
          "</ul><br />Have Fun!"
        }
      ]
    }
  };

  app.setupTourFunctions = function(){
    // Move the popover window slightly right.
    app.tour.slightlyRight = function() {
      $('.popover').css('left', parseFloat($('.popover').css('left'))+30);
    };
  }

})();
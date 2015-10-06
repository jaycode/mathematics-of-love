// Tour containing all our tour content.
var app = app || {};

(function() {
  /**
   * Setup all tour related settings here, including messages to display at each step.<br />
   * See {@link http://bootstraptour.com/api/ BootstrapTour API} for documentation.<br />
   * In addition to API docs, we can also add `topOffset` setting to adjust top position of displayed
   * tour window.
   */
  app.getTourSettings = function() {
    var highlightColor = '#F9E200';
    var highlightNegColor = 'black';
    return {
      // debug: true,
      storage: false,
      orphan: true,
      onShown: function(tour) {
        tour.adjustPos();
      },
      onStart: function(tour) {
        for (var i=0;i<3;i++) {
          d3.select('.goal_section.goal-'+i)
            .style('opacity', 1)
            .transition()
            .style('opacity', 0);
        };
      },
      onEnd: function(tour) {
        for (var i=0;i<3;i++) {
          d3.select('.goal_section.goal-'+i)
            .style('opacity', 0)
            .transition()
            .style('opacity', 1);
        };
      },
      steps: [
        {
          title: 'Introduction to Optimal Stopping Theory',
          content: 'This is a simulation of what may happen when we ' +
          'apply optimal stopping theory to choose from a set of candidates.<br />' +
          'Let\'s assume following simple dating rules: ' +
          '<ol>'+
            '<li>Once you decide to settle down, you can\'t change to other future partners remaining on your list.</li>' +
            '<li>Equally, once you reject someone, you can\'t go back and change your mind at a later date.</li>' +
          '</ol>'
        },
        {
          title: 'Rejection Phase',
          content: 'In here, we use the magic number 37% as our Rejection Phase, which means...<br /><br />' +
          '<i>Why 37%? Because, in optimal stopping theory, that gives the highest success probability. This is explained ' +
          '<a target="_blank" href="concept">here</a> if you are interested to know more.</i>',
          onShown: function(tour) {
            d3.select('#detail-rp')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('#detail-rp')
              .transition()
              .style('background-color', null);
          }
        },
        {
          title: 'Reject 37% candidates',
          content: 'First we reject 37% of all candidates and take note of their compatibility scores.',
          onShown: function(tour) {
            d3.select('#r_phase rect')
              .transition()
              .style('fill', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('#r_phase rect')
              .transition()
              .style('fill', null);
          }
        },
        {
          title: 'Choose the next better candidate',
          content: 'Then at the end of that rejection period, pick the first candidate who is better than ' +
          'the rest we have rejected.',
          onNext: function(tour) {
            app.vm.CurrentDetail.lifetime(422);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          },
          onShown: function(tour) {
            d3.select('.chart rect.focus')
              .transition()
              .style('fill', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('.chart rect.focus')
              .transition()
              .style('fill', null);
          }
        },
        {
          title: 'Where things could go wrong (1)',
          content: "Of course, it's well possible that we may meet the best candidate during our rejection phase. " +
          "And since the strategy requires us to reject them, we will then end up not finding anyone better, grow old and die alone, " +
          "probably nursing a deep hatred towards Mathematical equations.",
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
          },
          onShown: function(tour) {
            d3.select('.chart rect.focus')
              .transition()
              .style('fill', highlightNegColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('.chart rect.focus')
              .transition()
              .style('fill', null);
          }
        },
        {
          title: 'Where things could go wrong (2)',
          content: "On the other hand, it is quite possible too that during our rejection phase we may have only a streak of awful dates, " +
          "and the person right after that rejection phase is just marginally better. According to the strategy, again, we would have " +
          "to pick this person and end up with a suboptimal marriage.",
          onPrev: function(tour) {
            app.vm.CurrentDetail.lifetime(422);
            app.detail.redrawPlot(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          },
          onShown: function(tour) {
            d3.select(d3.selectAll('.bar')[0][7])
              .select('rect')
              .style('fill', highlightNegColor)
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select(d3.selectAll('.bar')[0][7])
              .select('rect')
              .transition()
              .style('fill', null)
          }
        },
        {
          title: "Success Rate",
          content: "Using purely Mathematical calculation, we get 37.1% chance " +
          "of success... <br /><b>But wait!</b> that seems <b>terribly low</b>. Are there other ways to improve this?",
          onShown: function(tour) {
            if (d3.select('.goal_section.goal-0').style('opacity') == 1) {
              for (var i=0;i<3;i++) {
                d3.select('.goal_section.goal-'+i)
                  .transition()
                  .style('opacity', 0);
              };
            }
            d3.select('.goal-3 .goal_success_rate')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('.goal-3 .goal_success_rate')
              .transition()
              .style('background-color', null);
          },
        },
        {
          title: "Relaxing our requirements",
          content: "In fact, there is. By relaxing our requirements to be happy with at least 15% highest candidates, we have improved our " +
          "chance of success to 55.8%.<br /><br /><i>Wait, I understand that 37.1% success chance earlier came from a mathematical formula, but where " +
          "did 55.8% came from?</i><br />This number came from this small experiment that we do, I'll explain in next slides (also how this can be improved further).",
          onShown: function(tour) {
            if (d3.select('.goal_section.goal-0').style('opacity') != 1) {
              for (var i=0;i<3;i++) {
                d3.select('.goal_section.goal-'+i)
                  .style('opacity', 0)
                  .transition()
                  .style('opacity', 1);
              };
            }
            d3.select('.goal-2 .goal_success_rate')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('.goal-2 .goal_success_rate')
              .transition()
              .style('background-color', null);
          },
          onNext: function(tour) {
            app.generated.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          }
        },
        {
          title: "A bigger picture",
          content: "Let's now see a bigger picture of this experiment. We have here a randomly generated dataset of 1,000 lifetimes, each with " +
          "different number of candidates and compatibility scores. You can see the details and distribution of generated dataset in this page.",
          onPrev: function(tour) {
            app.detail.view(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          },
          onShown: function(tour) {
            d3.selectAll('.tour-highlight')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.selectAll('.tour-highlight')
              .transition()
              .style('background-color', null);
          },
        },
        {
          title: "Dating Period and Yearly Potential Partners.",
          content: "In our dataset, we set some rule for data generation. In this example, we consider a person who is dating from age "+
          app.vm.Experiment.a1()+" to "+app.vm.Experiment.a2()+" and dating "+app.vm.Experiment.p1()+" to "+app.vm.Experiment.p2() +
          " candidates each year (which is a really low estimate according to <a href='http://www.femalefirst.co.uk/relationships/Women+Date+24+Men+A+Year-268977.html' target='_blank' rel='nofollow'>this research</a>).",
          onShown: function(tour) {
            d3.select('#generated-dating_period')
              .transition()
              .style('background-color', highlightColor);
            d3.select('#generated-potential_partners')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.select('#generated-dating_period')
              .transition()
              .style('background-color', null);
            d3.select('#generated-potential_partners')
              .transition()
              .style('background-color', null);
          }
        },
        {
          title: "Distribution of our Dataset",
          content: "Below graphs show the distribution of number and scores of candidates throughout lifetimes, which means how many lifetimes have how many " +
          "candidates and how big the average scores of these candidates. To make it a little more realistic I set it up with normal distribution (" +
          "i.e. most of the values are in the middle), since we don't really meet psycopaths or A-class single rockstars (or cool scientists, if that's your thing) everyday.",
          onNext: function(tour) {
            app.simulationAnalysis.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          },
          onShown: function(tour) {
            d3.selectAll('#generated-plot_area svg')
              .transition()
              .style('background-color', highlightColor);
            tour.adjustPos();
          },
          onHide: function(tour) {
            d3.selectAll('#generated-plot_area svg')
              .transition()
              .style('background-color', null);
          },
        },
        {
          title: "Analyzing our simulation results",
          content: "By repeating the simulation we did previously over our dataset and taking notes on our results, we get the following graph.",
          onPrev: function(tour) {
            app.generated.view(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          }
        },
        {
          title: "Busting the magic number 37%",
          content: "See that 37% is not all too magical when we relax our criteria to 15%. Instead the highest success rates seem to happen " +
          "at around 22-23% rejection phase. To improve your success rate further, rather than relaxing the criteria further, you can also " +
          "try to add the number of people you meet, or increase the range of your dating age.",
        },
        {
          title: "Pattern found in the dataset",
          content: "To me, what is more interesting in this graph is how the Mathematical equation can quite closely predict the pattern of the " +
          "dataset. Imagine that, <b>a set of randomly generated numbers</b> can be guessed in close accuracy using a single equation.<br />" +
          "Imagine the usefulness of this in other fields, for example in predicting the right portfolio to pick in Finance, or finding out the rate of " +
          "production failures in Aircraft jet engine factories.",
          onNext: function(tour) {
            app.generate.view(function() {
              tour.goTo(tour.getCurrentStep()+1);
            });
          },
        },
        {
          title: "Now Explore!",
          content: "Hopefully this brief introduction helped you to understand how Optimal Stopping Theory works for this particular problem.<br />" +
          "Now that you know where things are, you can tailor this experiment to your personal scenario and planning.<br />" +
          'Click on "Generate Different Dataset" link and create your own experiment. Here are some ideas:' +
          '<ul>'+
          "<li>What's your dating strategy? How many people are you planning / likely to meet each year? You can adjust that to see how it affects " +
          "your success rate.</li>"+
          "<li>Try out with a larger number of lifetimes, say 2,000. See how that will make the pattern more prominent.</li>" +
          "</ul><br />Have Fun!",
          onPrev: function(tour) {
            app.simulationAnalysis.view(function() {
              tour.goTo(tour.getCurrentStep()-1);
            });
          },
        }
      ]
    }
  };

  app.setupTourFunctions = function(){
    // Move the popover window slightly right.
    app.tour.adjustPos = function() {
      $('.popover').css('top', 0);
      $('.popover').css('left', window.innerWidth - parseFloat($('.popover').css('width')));
    };
  }

})();
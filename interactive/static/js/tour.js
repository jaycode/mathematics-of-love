// Tour object
var app = app || {};

(function() {
  app.tour = new Tour({
    debug: true,
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
            tour.goTo(tour.getCurrentStep()+1);
          });
        }
      },
      {
        // element: '#r_phase',
        element: '.marker.chosen',
        title: 'Where things could go wrong (2)',
        placement: 'top',
        content: "On the other hand, it is quite possible too that during our rejection phase we may have only a streak of awful dates, " +
        "and the person right after that rejection phase is just marginally better. According to the strategy, again, we would have " +
        "to pick this person and ended with a suboptimal marriage.",
        onShown: function(tour) {
          $('.popover').css('left', parseFloat($('.popover').css('left'))-120);
          $('.popover').css('top', parseFloat($('.popover').css('top'))-5);
        },
        onPrev: function(tour) {
          app.vm.CurrentDetail._lifetime(422);
          app.detail.redrawPlot(function() {
            tour.goTo(tour.getCurrentStep()-1);
          });
        }
      },
      {
        element: '.goal_section.goal-3',
        title: "The purpose of this simulation",
        content: "In this simulation, we try to find out, if we can retry our life 1,000 times, how succesful will we be in finding the right " +
        "partner using this strategy? As described in the introduction graph above, using purely Mathematical calculation, we get 37.12% chance " +
        "of success.",
        onShown: function(tour) {
          for (var i=0;i<3;i++) {
            debugger;
            d3.select('.goal_section.goal-'+i)
              .style('opacity', 1)
              .transition()
              .style('opacity', 0);
          }
        }
      },
      {
        title: 'Where did 37% come from?',
        content: ''
      },
      {
        title: 'How Accurate is This Strategy?'
      }
    ]
  });

  // Move the popover window slightly right.
  app.tour.slightlyRight = function() {
    $('.popover').css('left', parseFloat($('.popover').css('left'))+30);
  };

  app.tour.hide = function() {
    $('.popover').css('display', 'none');
  };

})();
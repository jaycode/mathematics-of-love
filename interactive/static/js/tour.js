// Tour object
var app = app || {};

(function() {
  app.tour = new Tour({
    storage: false,
    steps: [
      // {
      //   element: '#detail-plot_area',
      //   placement: 'top',
      //   title: 'Introduction to Optimal Stopping Theory',
      //   content: 'This is a simulation of what is likely to happen when we ' +
      //   'apply optimal stopping theory to choose from a set of candidates.<br />' +
      //   'Let\'s assume following simple dating rules: ' +
      //   '<ol>'+
      //     '<li>Once you decide to settle down, you can\'t change to other future partners remaining on your list.</li>' +
      //     '<li>Equally, once you reject someone, you can\'t go back and change your mind at a later date.</li>' +
      //   '</ol>'
      // },
      // {
      //   element: '#detail-rp',
      //   title: 'Rejection Phase',
      //   content: 'In here, we use the magic number 37% as our Rejection Phase, which means...'
      // },
      // {
      //   element: '#r_phase',
      //   title: 'Reject 37% Candidates',
      //   content: 'First we reject 37% of all candidates and take note of their compatibility scores.'
      // },
      {
        // element: '#r_phase',
        element: '.marker.chosen',
        title: 'Choose The Next Better Candidate',
        content: 'Then at the end of that rejection period, pick the first candidate who is better than ' +
        'the rest we have rejected.',
        onShown: function(tour) {
          tour.slightlyRight();
        },
        onNext: function(tour) {
          console.log('next1');
          
          app.vm.CurrentDetail.lifetime(422);
          app.detail.redrawPlot(function() {
            console.log('next callback1');
            // tour.getCurrentStep() is buggy as it returns step 6, so
            // we are forced to hardcode this here.
            // DON'T FORGET TO UPDATE WHEN STEPS CHANGED.
            tour.goTo(1);
          });
        }
      },
      {
        // element: '#r_phase',
        element: '.marker.top',
        title: 'Things could go wrong (1)',
        content: "Of course, it's well possible that we may find the best candidate during our rejection phase. " +
        "And since the strategy requires us to reject them, we will then end up not finding anyone better, grow old and die alone, " +
        "probably nursing a deep hatred towards Mathematical formulas.",
        onShown: function(tour) {
          tour.slightlyRight();
        },
        onNext: function(tour) {
          console.log('next2');
          // if (app.tour.getCurrentStep != app.tour.__currentStep) {
          //   return false;
          // }
          // else {
            console.trace();
            app.vm.CurrentDetail.lifetime(430);
            app.detail.redrawPlot(function() {
              console.log('next callback2');
              // tour.getCurrentStep() is buggy as it returns step 6, so
              // we are forced to hardcode this here.
              // DON'T FORGET TO UPDATE WHEN STEPS CHANGED.
              // tour.goTo(5);
            });
          // }
        },
        onPrev: function(tour) {
          app.vm.CurrentDetail.lifetime(165);
          app.detail.redrawPlot(function() {
            // tour.getCurrentStep() is buggy as it returns step 6, so
            // we are forced to hardcode this here.
            // DON'T FORGET TO UPDATE WHEN STEPS CHANGED.
            tour.goTo(0);
          });
        }
      },
      {
        // element: '#r_phase',
        element: '.marker.chosen',
        title: 'Things could go wrong (2)',
        content: "On the other hand, it is quite possible too that during our rejection phase we may have only a streak of awful dates, " +
        "and the person right after that rejection phase is just marginally better. According to the strategy, again, we would have " +
        "to pick this person and ended with a suboptimal marriage.",
        onShown: function(tour) {
          tour.slightlyRight();
        },
        onNext: function(tour) {
          console.log('next3?');
        },
        onPrev: function(tour) {
          debugger;
          app.vm.CurrentDetail._lifetime(422);
          app.detail.redrawPlot(function() {
            // tour.getCurrentStep() is buggy as it returns step 6, so
            // we are forced to hardcode this here.
            // DON'T FORGET TO UPDATE WHEN STEPS CHANGED.
            // app.tour.goTo(4);
          });
        }
      },
      {
        title: 'Where did 37% come from?',
        content: '',
        onNext: function(tour) {
          console.log('next4?');
        },
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

  app.tour.show = function() {
    debugger;
  };
})();
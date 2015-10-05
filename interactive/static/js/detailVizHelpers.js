var app = app || {};

(function() {
  /**
   * Helper methods used in {@link app.detailViz}.
   * ## Related Links
   * - {@link app.detailViz}
   * - {@link app.CurrentDetail}
   * @namespace app.detailVizHelpers
   */
  app.detailVizHelpers = {};

  /**
   * Prepare the data prior to use in {@link app.detailViz.draw}. Data is prepared by first
   * ordering it by age, then make the following marks in each datum:
   * - `id`: Sequential number starting from 1.
   * - `chosen_status`: -2 for rejected (under rejection phase), -1 for not chosen, 0 for undecided, 1 for chosen.
   * - `is_optimal`: Based on topX and percent, is this candidate part of our optimal goals?
   * - `is_top`: The top most candidate out of all.
   * ## Related Links
   * - {@link app.detailViz.draw}
   * @param {Array} data Unprepared data to be processed.
   * @param {number} rejectPercent Rejection Phase percentage to be applied for given data.
   *   Used to decide which marks above to use.
   * @param {number} topX Number of top value / percent of data to be considered. Get this from 
   *   the first element of Array returned by function {@link app.helpers.parseGoal}.
   * @param {boolean} percent Flag to decide whether to use percent or fixed number in topX.
   */
  app.detailVizHelpers.prepareData = function(data, rejectPercent, topX, percent) {
    data = _.sortBy(data, function(d) {return d['candidate_age_met'];});
    var allScores = _.map(data, function(d) {
      return d['candidate_score'];
    });
    var foundChosen = false;
    var maxVal = -9999;
    data = _.map(data, function(d, i) {
      d['id'] = i+1;
      d['is_optimal'] = app.detailVizHelpers.isAcceptable(d['candidate_score'], allScores, topX, percent);
      d['is_top'] = app.detailVizHelpers.isAcceptable(d['candidate_score'], allScores);
      d['chosen_status'] = 0;

      var r = rejectPercent/100;
      var id = Math.round(data.length * r);
      if (d['id'] <= id) {
        if (d['candidate_score'] > maxVal) {
          maxVal = d['candidate_score'];
        }
        d['chosen_status'] = -2;
      }
      else {
        if (!foundChosen) {
          foundChosen = d['candidate_score'] > maxVal;
          if (!foundChosen) {
            d['chosen_status'] = -1;
          }
          else {
            d['chosen_status'] = 1;
          }
        }
      }
      return d;
    });
    return data;
  }

  /**
   * Checks if given candidate's compatibility score is acceptable(i.e. within the top x percent / number of
   * everyone's compatibility scores, if 0 then only take the top one).
   * @param {float} compatibilityScore Compatibility score of this candidate to examine.
   * @param {Array} allCompatibilityScores Compatibility scores of all candidates.
   * @param {number} topX Number of top value / percent of data to be considered. Get this from 
   *   the first element of Array returned by function {@link app.helpers.parseGoal}.
   * @param {boolean} percent Flag to decide whether to use percent or fixed number in topX.
   */
  app.detailVizHelpers.isAcceptable = function(compatibilityScore, allCompatibilityScores, topX, percent) {
    topX = typeof(topX) == 'undefined' ? 1 : topX;
    percent = typeof(percent) == 'undefined' ? false : percent;

    var sortedCompatibilityScores = _.sortBy(allCompatibilityScores, function(v) {return parseFloat(v);});
    if (percent) {
      var minAccepted = _.last(sortedCompatibilityScores, parseInt(Math.round(allCompatibilityScores.length * topX / 100)))[0];
    }
    else {
      var minAccepted = _.last(sortedCompatibilityScores, parseInt(topX))[0];
    }
    return (compatibilityScore >= minAccepted);
  }

  /**
   * Tests `app.detailVizHelpers.isAcceptable` method.
   */
  app.detailVizHelpers.testIsAcceptable = function() {
    var compats = (_.range(1, 101,1));
    var result1 = app.detailVizHelpers.isAcceptable(100, compats);
    var result2 = app.detailVizHelpers.isAcceptable(95, compats);
    var result3 = app.detailVizHelpers.isAcceptable(96, compats, 5, true);
    var result4 = app.detailVizHelpers.isAcceptable(95, compats, 5, true);
    
    // What if the values aren't integers
    var compats = (_.range(1, 82, 1));
    var result5 = app.detailVizHelpers.isAcceptable(81, compats);
    var result6 = app.detailVizHelpers.isAcceptable(80, compats);
    var result7 = app.detailVizHelpers.isAcceptable(78, compats, 5, true);
    var result8 = app.detailVizHelpers.isAcceptable(77, compats, 5, true);

    var compatibilityScores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3];
    var result9 = app.detailVizHelpers.isAcceptable(10, compatibilityScores, 1, false);

    app.helpers.stopifnot(
      result1 == true &&
      result2 == false &&
      result3 == true &&
      result4 == false &&
      result5 == true &&
      result6 == false &&
      result7 == true &&
      result8 == false &&
      result9 == true
    );
  }

  /**
   * This method is not used in the app as it was used by users, but it was used to validate the data from server.<br />
   * Use this method to find to find answer to this question:<br />
   * If I rejected rejectPercent% of people, then find the next person who is better than the rejected ones,
   * do I end up with person with max compatibility?
   * @param {Array} compatibilityScores Compatibility scores of all candidates.
   * @param {number} rejectPercent Rejection phase percentage (1 for 1%, 2 for 2%, etc.).
   * @param {number} topX Number of top value / percent of data to be considered. Get this from 
   *   the first element of Array returned by function {@link app.helpers.parseGoal}.
   * @param {boolean} percent Flag to decide whether to use percent or fixed number in topX.
   */
  app.detailVizHelpers.rejectionTest = function(compatibilityScores, rejectPercent, topX, percent) {

    var pos = (parseInt(Math.round(compatibilityScores.length * rejectPercent / 100)) + 1);
    if (pos > compatibilityScores.length) {
      pos = compatibilityScores.length;
    }
    
    var maxScore = _.max(compatibilityScores.slice(0, pos));
    var foundId = _.find(compatibilityScores.slice(pos), function(num) { return num > maxScore; });
    if (foundId) {
      var posFinal = foundId + pos;
      return app.detailVizHelpers.isAcceptable(compatibilityScores[posFinal], compatibilityScores, topX, percent);
    }
    else {
      return false;
    }
  }

  /**
   * Tests `app.detailVizHelpers.rejectionTest` method.
   */
  app.detailVizHelpers.testRejectionTest = function() {
    var compatibilityScores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3];
    // pos 0 = at 0% rejected
    // pos 1 = at 1% rejected
    // pos 14 = at 14% rejected
    // pos 99 = at 99% rejected
    app.helpers.stopifnot(
      app.detailVizHelpers.rejectionTest(compatibilityScores, 0) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 34) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 35) == true &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 45) == true &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 85) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 99) == false
    );
    
    // With top x%
    compatibilityScores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3];
    // pos 0 = at 0% rejected
    // pos 1 = at 1% rejected
    // pos 14 = at 14% rejected
    // pos 99 = at 99% rejected
    app.helpers.stopifnot(
      app.detailVizHelpers.rejectionTest(compatibilityScores, 0, 30, true) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 24, 30, true) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 25, 30, true) == true &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 45, 30, true) == true &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 85, 30, true) == false &&
      app.detailVizHelpers.rejectionTest(compatibilityScores, 99, 30, true) == false
    );
  }
})();
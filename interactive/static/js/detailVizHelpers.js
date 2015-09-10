var app = app || {};

(function() {
  app.detailVizHelpers = {};

  app.detailVizHelpers.prepareData = function(data, topX, percent) {
    // Order by age, then make the following marks in each datum:
    // id = Sequential number starting from 1.
    // chosen_status: -1 for rejected, 0 for undecided, 1 for chosen.
    // is_optimal = Based on topX and percent, is this candidate part of our optimal goals?
    // is_top = The top most candidate out of all.
    data = _.sortBy(data, function(d) {return d['candidate_age_met'];});
    var allScores = _.map(data, function(d) {
      return d['candidate_score'];
    });
    var foundChosen = false;
    data = _.map(data, function(d, i) {
      d['id'] = i+1;
      console.log(topX);
      console.log(percent);
      d['is_optimal'] = app.detailVizHelpers.isAcceptable(d['candidate_score'], allScores, topX, percent);
      d['is_top'] = app.detailVizHelpers.isAcceptable(d['candidate_score'], allScores);
      d['chosen_status'] = 0;
      if (!foundChosen) {
        foundChosen = d['is_optimal'];
        if (!foundChosen) {
          d['chosen_status'] = -1;
        }
        else {
          d['chosen_status'] = 1;
        }
      }
      return d;
    });
    debugger;

    return data;
  }

  // Checks if given compatibilityScores is acceptable(i.e. within the top x percent / number of
  // everyone, if 0 then only take the top one).
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

  // topX: Float, showing the top x percent or //, depending on percent.
  app.detailVizHelpers.rejectionTest = function(compatibilityScores, topX, percent) {
    var s = [];
    // If I rejected n% of people, then find the next person who is better than the rejected ones,
    // do I end up with person with max compatibility?
    // Then make that into a true/false table.
    for(var x=0; x < 100; x++) {
      var pos = (parseInt(Math.round(compatibilityScores.length * x / 100)) + 1);
      if (pos > compatibilityScores.length) {
        pos = compatibilityScores.length;
      }
      
      var maxScore = _.max(compatibilityScores.slice(0, pos));
      var foundId = _.find(compatibilityScores.slice(pos), function(num) { return num > maxScore; });
      if (foundId) {
        var posFinal = foundId + pos;
        s.push(app.detailVizHelpers.isAcceptable(compatibilityScores[posFinal], compatibilityScores, topX, percent));
      }
      else {
        s.push(false);
      }
    }

    return(s);
  }

  // Testing if function rejectionTest works as expected.
  app.detailVizHelpers.testRejectionTest = function() {
    var compatibilityScores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3];
    var results = app.detailVizHelpers.rejectionTest(compatibilityScores);
    // pos 0 = at 0% rejected
    // pos 1 = at 1% rejected
    // pos 14 = at 14% rejected
    // pos 99 = at 99% rejected
    app.helpers.stopifnot(
      results[0] == false &&
      results[34] == false &&
      results[35] == true &&
      results[45] == true &&
      results[85] == false &&
      results[99] == false
    );
    
    // With top x%
    compatibilityScores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3];
    results = app.detailVizHelpers.rejectionTest(compatibilityScores, 30, true);
    // pos 0 = at 0% rejected
    // pos 1 = at 1% rejected
    // pos 14 = at 14% rejected
    // pos 99 = at 99% rejected
    app.helpers.stopifnot(
      results[0] == false &&
      results[24] == false &&
      results[25] == true &&
      results[45] == true &&
      results[85] == false &&
      results[99] == false
    );
  }
})();
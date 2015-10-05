var app = app || {};

(function() {
  "use strict";
  /**
   * Main Visualization where Simulation Analysis is displayed.
   * ## Related Links
   * - {@link app.Experiment}
   * - {@link app.simulationAnalysis}
   * - {@link app.vizHelpers}
   * @namespace app.mainViz
   */
  app.mainViz = {};

  /**
   * Runs an animation to remove currently displayed elements inside selector, then pass
   * several parameters to {@link app.mainViz.drawGSA} function.
   * @param {Array} data Data from server that include all calculations over different {@link app.data.experiment.goals goals}.
   * @param {string} selector CSS selector where plots will be drawn at.
   * @param {function} callback Call this function when plot is drawn.
   */
  app.mainViz.draw = function(data, selector, callback) {
    d3.select(selector)
      .transition()
      .style('opacity', 0)
      .each('end', function() {
        d3.select(selector)
          .html('');
          
        app.mainViz.drawGSA(data, selector, callback);
        d3.select(selector)
          .transition()
          .style('opacity', 1);

      });
  }

  /**
   * Draws simulation analysis plot based on given data,
   * inside the element pointed by css selector, then runs a callback function.
   * @param {Array} data Data from server that include all calculations over different {@link app.data.experiment.goals goals}.
   * @param {string} selector CSS selector where plots will be drawn at.
   * @param {function} callback Call this function when plot is drawn.
   */
  app.mainViz.drawGSA = function(data, selector, callback) {
    var width = 800,
        height = 400,
        marginLeft = 60,
        marginTop = 30,
        bottomOffset = 60,
        right_offset = 20,
        radius = 5;

    d3.select(selector)
      .append('svg')
        .attr('width', width + marginLeft + right_offset)
        .attr('height', height + marginTop + bottomOffset)
      .append('g')
        .attr('id', 'g-sa')
        .attr('class','chart sa_plot');

    var xExtent = [0, 100];

    // Find range of y column.
    var max = 0,
        min = 0;
    data.goals.forEach(function(goal) {
      var localMax = d3.max(goal['data']);
      if (localMax > max) {
        max = localMax;
      }
      var localMin = d3.min(goal['data']);
      if (localMin < min) {
        min = localMin;
      }
    });
    var yExtent = [min, max];
    var scales = app.vizHelpers.drawAxes('#g-sa', {
      xExtent: xExtent,
      yExtent: yExtent,
      width: width,
      height: height,
      marginLeft: marginLeft,
      marginTop: marginTop,
      bottomOffset: bottomOffset,
      xLabel: "% Rejected",
      yLabel: "Success Rate (%)",
      title: "Success Rates Throughout Different Rejection Periods And Goals"
    });

    var xScale = scales[0];
    var yScale = scales[1];

    // Draw the lines.
    var lineGen = d3.svg.line()
      .x(function(d, i) {
        return xScale(i);
      })
      .y(function(d) {
        return yScale(d);
      });


    data.goals.forEach(function(goal, lineId) {
      var path = d3.select('#g-sa')
        .append('svg:path')
          .attr('class', 'path-main ' + app.data.settings.colors[goal.color_id]['class'])
          .attr('d', lineGen(goal['data']))
          .attr('fill', 'none')

      var totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(1000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

      // Create invisible rects for graph interaction (only need 1).
      if (lineId == 0) {
        d3.select('#g-sa')
          .append('g')
            .attr('class', 'hidden_rects')      
              .selectAll('rect')
              .data(goal['data'])
              .enter()
              .append('rect')
              .attr('transform', function(d, i) { return 'translate('+xScale(i)+', '+0+')';})
              .attr('width', (xScale(1) - xScale(0)))
              .attr('height', height)
      }

      // Create invisible circles for graph interaction.
      d3.select('#g-sa')
        .append('g')
          .attr('class', 'hidden_circles')      
            .selectAll('circle')
            .data(goal['data'])
            .enter()
            .append('circle')
              .attr('class', 'datum-circle ' + app.data.settings.colors[goal.color_id].class)
              .attr('cx', function(d, i) {
                return xScale(i);
              })
              .attr('cy', function(d, i) {
                return yScale(d);
              })
              .attr('r', radius)
              .style('opacity', 0);
    });

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d, i) {
        return "<strong>Success Rate:</strong> <span style='color:red'>" + app.helpers.formatPercent(Math.round(d*10000)/100) +
          "</span><br /><strong>Rejected:</strong> <span>" + app.helpers.formatPercent(i%100) + "</span>";
      });

    d3.select(selector + ' svg').call(tip);

    // Graph interaction
    d3.selectAll('#g-sa .hidden_circles circle')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    d3.selectAll('#g-sa .hidden_rects rect')
      .on('mouseover', function(yValue, elementId) {
        var self = this;
        var closestId = elementId % 100;

        // tip.show(yValue, elementId);
        // Update CurrentDetail. Tooltip should automatically shows
        // thanks to KnockoutJs.
        app.vm.CurrentDetail.rejection_phase(closestId);
        d3.select('#detail_window')
          .classed('show-block', true);

        // Get the bottom-most y position and draw tooltip underneath it.
        var allY = [];
        data.goals.forEach(function(g) {
          allY[allY.length] = g.data[closestId];
        });
        var ymin = d3.min(allY);
        app.vm.CurrentDetail.window_left((xScale(closestId)-10) + 'px');

        // Following the mouse (not cool).
        // var coordinates = d3.mouse(self);
        // app.vm.CurrentDetail.window_top((coordinates[1]+30) + 'px');
        app.vm.CurrentDetail.window_top((yScale(ymin) + 40) + 'px');

        // Animate the circles.
        // Initially I used radius animation, but animation lags so much
        // so I disabled them. I kept the code for future reference.
        d3.selectAll('#g-sa .hidden_circles circle')
          .classed('active', false)
          // .attr('r', radius)
          .style('opacity', 0);
          // .transition();
        d3.selectAll('#g-sa .hidden_circles circle:nth-of-type('+(closestId+1)+')')
          .classed('active', true)
          .style('opacity', 1);
          // .transition()
          // .style('opacity', 1)
          // .each('end', function() {
          //   // d3.selectAll('#g-sa .hidden_circles circle')
          //   //   .attr('r', 0);
          //   // d3.selectAll('#g-sa .hidden_circles circle:nth-of-type('+closestId+')')
          //   //   .attr('r', radius);
          // });

      });

    if (typeof(callback) == 'function') {
      callback();
    }
  }

  /**
   * Helpers used in drawing the visualizations.
   * ## Related Links
   * - {@link app.mainViz}
   * - {@link app.detailViz}
   * - {@link app.introViz}
   * - {@link app.generatedViz}
   * @namespace app.vizHelpers
   */
  app.vizHelpers = {};

  /**
   * Draws axes used in a visualization.
   * @param {string} chartSelector CSS selector where the chart is drawn.
   * @param {object} params Setting parameters for the drawn axes.
   * @param {object} params.xExtent xExtent object (min,max) of x axis.
   * @param {object} params.yExtent yExtent object (min, max) of y axis.
   * @param {number} params.width Width of plot.
   * @param {number} params.height Height of plot.
   * @param {number} params.marginLeft Left margin before where plot is drawn.
   * @param {number} params.marginTop Top margin before where plot is drawn.
   * @param {number} params.bottomOffset Offset at the bottom after where the plot is drawn.
   * @param {string} params.xLabel Label of x axis.
   * @param {string} params.yLabel Label of y axis.
   * @param {string} params.title Title of plot.
   */
  app.vizHelpers.drawAxes = function(chartSelector, params) {
    // Create x-axis scale.
    if (params.categorical) {
      var xScale = d3.scale.ordinal()
        .rangeBands([params.marginLeft, params.width+params.marginLeft])
        .domain(_.range(params.xExtent[0], params.xExtent[1]+1));
    }
    else {
      var xScale = d3.scale.linear()
        .range([params.marginLeft, params.width+params.marginLeft])
        .domain(params.xExtent);
    }    

    // Create y-axis scale.
    var yScale = d3.scale.linear()
      .range([params.height, params.marginTop])
      .domain(params.yExtent);

    // Create the actual x-axis.
    var xAxis = d3.svg.axis()
      .scale(xScale)

    d3.select(chartSelector)
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', "translate(0," + params.height + ")")
      .call(xAxis);

    // Add x-axis label
    var xAxisLength = xScale(params.xExtent[1]) - xScale(params.xExtent[0]);
    d3.select(chartSelector)
      .append('text')
        .attr('class', 'x_label axis_label')
        .attr('text-anchor', 'middle')
        .attr('transform', "translate("+(xAxisLength/2 + params.marginLeft)+","+(params.marginTop+params.height+params.bottomOffset-15)+")")
        .text(params.xLabel);

    // Create the actual y-axis.
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    d3.select(chartSelector)
      .append('g')
        .attr('class', 'y axis')
        .attr('transform', "translate(" + (params.marginLeft-3) + ",0)")
      .call(yAxis);

    // Add y-axis label
    var yAxisHeight = yScale(params.yExtent[0]) - yScale(params.yExtent[1]);
    d3.select(chartSelector)
      .append('text')
        .attr('class', 'y_label axis_label')
        .attr('text-anchor', 'middle')
        .attr('transform', "rotate(270), " +
          "translate("+(-params.marginTop-yAxisHeight/2)+","+20+")")
        .text(params.yLabel);

    // Add plot title
    d3.select(chartSelector)
      .append('text')
        .attr('class', 'plot_title')
        .attr('text-anchor', 'middle')
        .attr('transform', "translate("+(params.width/2 + params.marginLeft)+","+20+")")
        .text(params.title);

    return [xScale, yScale];
  }
})();
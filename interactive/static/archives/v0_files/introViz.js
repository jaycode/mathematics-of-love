var app = app || {};

(function() {
  "use strict";
  app.introViz = {};
  app.introViz.drawIntro = function(data) {
    data = data.partners;
    // Todo: when screen size changed, change this.
    var width = 800,
        height = 400,
        marginLeft = 60,
        marginTop = 50,
        bottomOffset = 20,
        right_offset = 20,
        radius = 5,
        selector = '#intro_viz',
        chartSelectorId = 'g-i',
        chartSelector = '#g-i';

    var radius = 3;
    var color = "blue";

    d3.select(selector)
      .append('svg')
        .attr('width', width + marginLeft + right_offset)
        .attr('height', height + marginTop + bottomOffset)
      .append('g')
        .attr('id', chartSelectorId)
        .attr('class','chart i_plot');

    var xExtent = d3.extent(data, function(d,i) {
      return i;
    });
    var yExtent = d3.extent(data, function(d) {
      return d;
    });

    var scales = app.vizHelpers.drawAxes(chartSelector, {
      xExtent: xExtent,
      yExtent: yExtent,
      width: width,
      height: height,
      marginLeft: marginLeft,
      marginTop: marginTop,
      bottomOffset: bottomOffset,
      xLabel: "# Candidates Rejected / r",
      yLabel: "Success Rate (%) / P(r)",
      title: "Success Rates Throughout Different Rejection Periods And Goals"
    });
    var xScale = scales[0];
    var yScale = scales[1];

    // Draw the line.
    var lineGen = d3.svg.line()
      .x(function(d, i) {
        return xScale(i);
        // return xScale(d['x']);
      })
      .y(function(d) {
        return yScale(d);
        // return yScale(d['y']);
      });

    d3.select(chartSelector)
      .append('svg:path')
      .attr('class', 'path-intro')
      .attr('d', lineGen(data));

    // Draw the circles.

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d, i) {
        return "<strong>Success Rate:</strong> <span style='color:red'>" + d +
          "</span><br /><strong>Candidates Rejected:</strong> <span>" + i + "</span>";
      });

    d3.select(selector + ' svg').call(tip);

    d3.select(chartSelector)
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle');

    d3.selectAll('circle')
      .attr('cx', function(d, i) {
        return xScale(i);
      })
      .attr('cy', function(d) {
        return yScale(d);
        // return yScale(d['y']);
      })
      .attr('r', radius)
      .attr('fill', color)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }
})();
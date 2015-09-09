var app = app || {};

(function() {
  "use strict";
  app.introViz = {};
  app.introViz.drawIntro = function(data) {
    data = data.partners;
    var margin = 30,
        width = 600,
        height = 300,
        right_offset = 20;

    var radius = 3;
    var color = "blue";

    var svg = d3.select('#intro_viz')
      .append('svg')
        .attr('width', width + margin + right_offset)
        .attr('height', height + margin)
      .append('g')
        .attr('class','chart');

    // Find range of x column.
    var xExtent = d3.extent(data, function(d,i) {
      return i;
    });

    // Find range of y column.
    var yExtent = d3.extent(data, function(d) {
      return d;
    });

    // Create x-axis scale.
    var xScale = d3.scale.linear()
      .range([margin, width])
      .domain(xExtent);

    // Create y-axis scale.
    var yScale = d3.scale.linear()
      .range([height, margin])
      .domain(yExtent);

    // Create the actual x-axis.
    var xAxis = d3.svg.axis()
      .scale(xScale)

    d3.select("svg > g.chart")
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', "translate(0," + height + ")")
      .call(xAxis);

    // Create the actual y-axis.
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    d3.select("svg > g.chart")
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', "translate(" + margin + ",0)")
      .call(yAxis);

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

    d3.select('svg > g.chart')
      .append('svg:path')
      .attr('class', 'path-intro')
      .attr('d', lineGen(data));

    // Draw the circles.
    d3.select('svg > g.chart')
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
      .attr('fill', color);
  }
})();
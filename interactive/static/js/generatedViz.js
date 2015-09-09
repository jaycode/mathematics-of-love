var app = app || {};

(function() {
  "use strict";
  app.generatedViz = {};

  app.generatedViz.draw = function(data, selector) {
    d3.select(selector)
      .transition()
      .style('opacity', 0)
      .each('end', function() {
        d3.select(selector)
          .html('');
          
        app.generatedViz.drawG1(data, selector);
        app.generatedViz.drawG2(data, selector);
        d3.select(selector)
          .transition()
          .style('opacity', 1);

      });
  }

  app.generatedViz.drawG1 = function(data, selector) {
    var margin = 50,
        width = 400,
        height = 300,
        right_offset = 20;

    d3.select(selector)
      .append('svg')
        .attr('width', width + margin + right_offset)
        .attr('height', height + margin)
      .append('g')
        .attr('id', 'g1')
        .attr('class','chart');

    // We need to find distribution of total candidates throughout all lifetimes.
    // To do this, first we find number of total candidates per each lifetime,
    // then find how many lifetimes each total candidates value has.
    var nested = d3.nest()
      .key(function(d) {
        return d['lifetime'];
      })
      .rollup(function(leaves) {
        return {
          'total_candidates': leaves.length,
          'lifetime': leaves[0]['lifetime']
        };
      })
      .entries(data);
      
    var nested = d3.nest()
      .key(function(d) {
        return d['values']['total_candidates'];
      })
      .rollup(function(leaves) {
        return {
          'total_candidates': leaves[0]['values']['total_candidates'],
          'total_lifetimes': leaves.length
        }
      })
      .entries(nested);

    app.generatedViz.drawHistContent(nested, '#g1', {
      xFunc: function (d) {return d['values']['total_candidates'];},
      yFunc: function (d) {return d['values']['total_lifetimes'];},
      width: width,
      height: height,
      margin: margin,
      xLabel: "Number of Candidates",
      yLabel: "Lifetime Count",
      title: "Number of Candidates Distribution",
      categorical: true
    });

  }

  app.generatedViz.drawG2 = function(data, selector) {
    var margin = 50,
        width = 400,
        height = 300;

    d3.select(selector)
      .append('svg')
        .attr('width', width + margin)
        .attr('height', height + margin)
      .append('g')
        .attr('id', 'g2')
        .attr('class','chart');
    
    var chart_selector = '#g2';
    var map = data.map(function(d) {return d['candidate_score'];});
    var histogram = d3.layout.histogram().bins(100)(map);
    
    app.generatedViz.drawHistContent(histogram, '#g2', {
      xFunc: function (d) {return d.x;},
      yFunc: function (d) {return d.y;},
      width: width,
      height: height,
      margin: margin,
      xLabel: "Candidate Scores",
      yLabel: "Lifetime Count",
      title: "Candidate Score Distribution"
    });
  }

  // params = {
  //   width: Width of chart.
  //   height: Height of chart.
  //   margin: Margin of chart. 
  // }
  app.generatedViz.drawHistContent = function(data, chart_selector, params) {
    // Find range of x axis.
    var xExtent = d3.extent(data, params.xFunc);
    if (params.categorical) {
      xExtent[1] += 1;
    }

    // Find range of y axis.
    var yExtent = d3.extent(data, params.yFunc);
    yExtent[0] = 0;

    // Create x-axis scale.
    var xScale = d3.scale.linear()
      .range([params.margin, params.width+params.margin])
      .domain(xExtent);

    // Create y-axis scale.
    var yScale = d3.scale.linear()
      .range([params.height, params.margin])
      .domain(yExtent);

    // Create the actual x-axis.
    var xAxis = d3.svg.axis()
      .scale(xScale)

    d3.select(chart_selector)
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', "translate(0," + params.height + ")")
      .call(xAxis);

    if (params.categorical) {
      // Shift labels by half the distance.
      d3.select(chart_selector).selectAll('.x .tick')
        .attr('transform', function(v) {
          var tickWidth = xScale(v+1) - xScale(v);
          return 'translate('+(xScale(v) + tickWidth/2)+',0)';});
      // And remove last tick.
      d3.select(chart_selector).select('.x .tick:last-of-type').remove();
    }

    // Add x-axis label
    var xAxisLength = xScale(xExtent[1]) - xScale(xExtent[0]);
    d3.select(chart_selector)
      .append('text')
        .attr('class', 'x_label axis_label')
        .attr('text-anchor', 'middle')
        .attr('transform', "translate("+(xAxisLength/2 + params.margin)+","+(params.margin+params.height-15)+")")
        .text(params.xLabel);

    // Create the actual y-axis.
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    d3.select(chart_selector)
      .append('g')
        .attr('class', 'y axis')
        .attr('transform', "translate(" + params.margin + ",0)")
      .call(yAxis);

    // Add y-axis label
    var yAxisHeight = yScale(yExtent[0]) - yScale(yExtent[1]);
    d3.select(chart_selector)
      .append('text')
        .attr('class', 'y_label axis_label')
        .attr('text-anchor', 'middle')
        .attr('transform', "rotate(270), " +
          "translate("+(-params.margin-yAxisHeight/2)+","+20+")")
        .text(params.yLabel);

    // Add plot title
    d3.select(chart_selector)
      .append('text')
        .attr('class', 'plot_title')
        .attr('text-anchor', 'middle')
        .attr('transform', "translate("+(params.width/2 + params.margin)+","+20+")")
        .text(params.title);

    // Set up the bars.
    var xAxisWidth = xScale(xExtent[1]) - xScale(xExtent[0]);
    var binsize = xAxisWidth / data.length;
    // var binsize = params.width / data.length;
    var bar = d3.select(chart_selector)
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { 
          return "translate(" + 
             (params.margin + i * (binsize)) + "," + yScale(0) + ")"; })
    bar
      .transition()
      .duration(1500)
      .attr("transform", function(d, i) { 
        return "translate(" + 
           (params.margin + i * (binsize)) + "," + yScale(params.yFunc(d)) + ")"; });
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);

    // add rectangles of correct size at correct location
    bar.append("rect")
      .attr('height', 0)
      // .attr("x", params.binmargin)
      .attr("width", binsize)
      .transition()
      .duration(1500)
      .attr("height", function(d) { return params.height - yScale(params.yFunc(d)); });
  }
})();
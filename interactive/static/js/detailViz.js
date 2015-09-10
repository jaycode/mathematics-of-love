var app = app || {};

(function() {
  app.detailViz = {
    chartSelector: '#g-d',
    width: 800,
    height: 400,
    marginLeft: 60,
    marginTop: 80,
    x2Height: 60,
    bottomOffset: 60,
    rightOffset: 20,
    xExtent: null,
    yExtent: null,
    xScale: null,
    yScale: null,
    binsize: null,
    data: [],
    topX: null,
    percent: false
  };

  // data: list of compatibilities for given lifetime.
  // selector: string
  // params: {
  //   rejectionPhase: integer (0 to 100).
  //   topX: numeric, top number of / percentage of candidates to choose from.
  //   percent: boolean, to decide whether to use percent or fixed number for topX.
  // }
  app.detailViz.draw = function(data, selector, params) {
    var self = this;
    self.topX = params['topX'];
    self.percent = params['percent'];
    self.data = app.detailVizHelpers.prepareData(data, self.topX, self.percent);
    d3.select(selector)
      .append('svg')
        .attr('width', self.width + self.marginLeft + self.rightOffset)
        .attr('height', self.height + self.marginTop + self.x2Height + self.bottomOffset)
      .append('g')
        .attr('id', 'g-d')
        .attr('class','chart d_plot');

    var x2Area = d3.select(self.chartSelector)
      .append('g')
      .attr('class', 'x2Area')
      .attr('transform', 'translate(0, '+self.height+')')

    self.xExtent = [1, self.data.length];
    self.yExtent = d3.extent(self.data, function(d) {return d['candidate_score'];});

    var scales = app.vizHelpers.drawAxes(self.chartSelector, {
      xExtent: self.xExtent,
      yExtent: self.yExtent,
      width: self.width,
      height: self.height,
      marginLeft: self.marginLeft,
      marginTop: self.marginTop,
      bottomOffset: self.bottomOffset,
      xLabel: "Candidates",
      yLabel: "Compatibility Score",
      title: "Lifetime Simulation",
      categorical: true
    });

    self.xScale = scales[0];
    self.yScale = scales[1];
    
    // Categorize x-axis in ages.
    // Draw this before drawing axes as we want to show this underneath.
    // ------
    var nestByAge = d3.nest()
      .key(function(d) {
        return d['candidate_age_met'];
      })
      .rollup(function(leaves) {
        return {
          'total_candidates': leaves.length,
          'first_candidate_id': parseInt(leaves[0].id),
          'last_candidate_id': parseInt(_.last(leaves).id)
        };
      })
      .entries(self.data);

    self.binsize = (self.xScale(_.last(self.data).id) - self.xScale(data[0].id)) / self.data.length;
    var x2Extent = d3.extent(self.data, function(d) {return d['candidate_age_met'];});
    var i = 0;
    _.range(x2Extent[0], x2Extent[1]+1).forEach(function(x2) {
      var group = _.find(nestByAge, function(g) {return g.key == x2.toString();});

      if (group) {
        var startPos = self.xScale(group['values']['first_candidate_id']);
        var endPos = self.xScale(group['values']['last_candidate_id'])+self.binsize;
        var areaWidth = endPos - startPos;
        x2Area
          .append('rect')
          .attr('transform', 'translate('+startPos+', 0)')
          .attr('height', self.x2Height)
          .attr('width', 0)
          .attr('class', 'x2 x2-'+i)
          .style('fill', app.helpers.pickColor(i))
          .transition()
            .attr('width', areaWidth);

        d3.select(self.chartSelector)
          .append('text')
            .attr('class', 'x2-label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate('+(startPos + areaWidth/2)+','+(self.height+(self.x2Height/2 + 12))+')')
            .text(x2);
        i++;
      }

    });
    // ------

    // Taking care of additional labels.
    // ------
    // x-axes labels
    d3.select(self.chartSelector)
      .append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate('+(self.marginLeft-10)+','+(self.height+16)+')')
        .text('# :');

    d3.select(self.chartSelector)
      .append('text')
        .attr('class', 'x2-label')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate('+(self.marginLeft-17)+','+(self.height+(self.x2Height/2 + 5))+')')
        .text("Age");

    d3.select(self.chartSelector)
      .append('text')
        .attr('class', 'x2-label')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate('+(self.marginLeft-17)+','+(self.height+(self.x2Height/2 + 22))+')')
        .text("Met");

    d3.select(self.chartSelector)
      .append('text')
        .attr('class', 'x2-label')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate('+(self.marginLeft-10)+','+(self.height+(self.x2Height/2 + 12))+')')
        .text(":");
    // ------

    app.detailViz.drawHistContent.call(self);

    app.detailViz.drawExperiment.call(self, self.data);
  };

  app.detailViz.drawHistContent = function() {
    var self = this;
    var xFunc = function(d) {return d['id'];};
    var yFunc = function(d) {return d['candidate_score']};

    var bar = d3.select(self.chartSelector)
      .selectAll(".bar")
      .data(self.data)
      .enter()
      .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          return "translate(" + 
             (self.xScale(xFunc(d))) + "," + self.yScale(self.yExtent[0]) + ")";
        });

    bar
      .transition()
      .duration(1500)
      .attr("transform", function(d, i) { 
        return "translate(" + 
           (self.xScale(xFunc(d))) + "," + self.yScale(yFunc(d)) + ")";
      });

      // Todo: Add tooltips.
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);

    // Add rectangles of correct size at correct location.
    bar.append("rect")
      .attr('height', 0)
      .attr("width", self.binsize)
      .transition()
      .duration(1500)
      .attr("height", function(d) { return self.height - self.yScale(yFunc(d)); });
  };

  app.detailViz.addHistTooltip = function(data, chartSelector, params) {

  }

  // Pass in data to avoid prepareData being called again.
  app.detailViz.drawExperiment = function(data) {
    var self = this;
    if (typeof(data) == 'undefined') {
      var data = app.detailVizHelpers.prepareData(self.data, self.topX, self.percent);
    }
  }
})();
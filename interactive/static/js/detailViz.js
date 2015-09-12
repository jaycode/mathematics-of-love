var app = app || {};

(function() {
  app.detailViz = {
    chartSelector: '#g-d',
    width: 800,
    height: 400,
    marginLeft: 60,
    marginTop: 80,
    x2Height: 60,
    bottomOffset: 20,
    rightOffset: 20,
    xExtent: null,
    yExtent: null,
    xScale: null,
    yScale: null,
    binsize: null,
    data: [],
    topX: null,
    percent: false,
    rejectionPhase: null
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
    self.topX = typeof(params['topX']) == 'undefined' ? self.topX : params['topX'];
    self.percent = typeof(params['percent']) == 'undefined' ? self.percent : params['percent'];
    self.rejectionPhase = typeof(params['rejectionPhase']) == 'undefined' ? self.rejectionPhase : params['rejectionPhase'];
    self.data = app.detailVizHelpers.prepareData(data, self.rejectionPhase, self.topX, self.percent);
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

    app.detailViz.drawRejectionPhase.call(self, function() {
      app.detailViz.drawExperiment.call(self, self.data, params.callback);
    });
  };

  app.detailViz.drawRejectionPhase = function(callback) {
    var self = this;
    var selector = '#r_phase';
    var selector_id = 'r_phase';
    d3.select(selector)
      .remove();

    var r = self.rejectionPhase/100;
    var id = Math.round(self.data.length * r);
    if (id > 0) {
      var x = self.marginLeft;
      var y = self.marginTop;
      var width = self.xScale(id+1) - x;
      var height = self.height - self.marginTop;
      var area = d3.select(self.chartSelector)
        .insert('g', ':first-child')
          .classed('r_phase', true)
          .attr('id', selector_id)
          .attr('transform', 'translate('+x+', '+y+')')
          .attr('width', width)
          .attr('height', height);
      area
        .append('rect')
          .attr('transform', 'translate('+(width-5)+', '+height+')')
          .attr('width', 5)
          .transition()
          .attr('transform', 'translate('+(width-5)+', '+0+')')
          .attr('height', height)
          .each('end', function() {
            d3.select(selector)
              .select('rect')
                .transition()
                .attr('transform', 'translate('+0+', '+0+')')
                .attr('width', width)
                .each('end', function() {
                  callback();
                });          
          });
      area
        .append('text')
          .attr('class', 'x2-label')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate('+(0 + width/2)+','+30+')')
          .text("Rejection")
          .style('opacity', 0)
          .transition()
          .style('opacity', 1);
      area
        .append('text')
          .attr('class', 'x2-label')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate('+(0 + width/2)+','+60+')')
          .text("Phase")
          .style('opacity', 0)
          .transition()
          .style('opacity', 1);

    }
  }

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
  app.detailViz.drawExperiment = function(data, callback) {
    var self = this;
    if (typeof(data) == 'undefined') {
      var data = app.detailVizHelpers.prepareData(self.data, self.rejectionPhase, self.topX, self.percent);
    }
    var bars = d3.selectAll(self.chartSelector+' .bar')
    bars.select('rect')
      .classed('focus', false);
    d3.selectAll(self.chartSelector + ' .marker').remove();

    // Number of markers still animated.
    // Used to decide when to call the callback.
    self._animatedMarkers = 0;

    data.forEach(function(d, id) {
      var x = self.xScale(d['id']);
      var y = self.yScale(d['candidate_score']);

      var bar = d3.select(bars[0][id])
      if (d['is_optimal']) {
        // nth-of-type cannot work with class i.e.:
        // .bar:nth-of-type('+(d['id'])+') still chooses the first few non- .bar
        // g's, so we have to do it the javascript way.

        bar.select('rect')
          .classed('focus', true);
      }

      if (d['is_top']) {
        app.detailViz.drawMarker.call(self, bar, app.images.star, d, id, 'yellow', 'top', callback);
      }
      if (d['chosen_status'] == 1) {
        app.detailViz.drawMarker.call(self, bar, app.images.ok, d, id, 'green', 'chosen', callback);
      }
      else if (d['chosen_status'] == -1) {
        app.detailViz.drawMarker.call(self, bar, app.images.remove, d, id, 'red', 'rejected', callback);
      }
      else if (d['chosen_status'] == -2) {
        app.detailViz.drawMarker.call(self, bar, app.images.remove2, d, id, 'red', 'unchosen', callback);
      }

    });
    if (typeof(callback) == 'function' && self._animatedMarkers == 0) {
      callback();
    }
  }

  app.detailViz.drawMarker = function(bar, image, d, i, color, elclass, callback) {
    var self = this;
    self._animatedMarkers++;

    var img = bar
      .insert('g', ':first-child')
      .classed('marker', true)
      .classed(elclass, true);

    img
      .html(image);

    // Needed to avoid translation while scaling.
    // See: http://stackoverflow.com/questions/24173560/svg-scale-without-moving-location
    // var bbox=img.node().getBBox();
    // var cx=bbox.x+(bbox.width/2),
    //     cy=bbox.y+(bbox.height/2);   // finding center of element
    // // var scalex=self.binsize/bbox.width, scaley=self.binsize/bbox.width;    // your desired scale
    // var scalex=1, scaley=1;
    // var imgLeft=-cx*(scalex-1);
    // var imgTop2=-cy*(scaley-1) - bbox.height*2;                        

    // ALRIGHT I GIVE UP! NO SCALING FOR NOW!!!


    // var imgWidth = img.node().getBoundingClientRect().width;
    var imgHeight = img.node().getBoundingClientRect().width;
    // var imgScaleWidth = self.binsize/imgWidth;

    var imgLeft = self.xScale(d['id']);
    var imgTop1 = self.yScale(d['candidate_score']);
    var imgTop2 = (self.yScale(d['candidate_score']) - imgHeight - 10);

    imgTop1 = 0;
    imgTop2 = -imgHeight*2;
    imgLeft = -7;

    // img.select('path').attr('transform', 'scale('+(scalestr)+')');
    img
      .attr('transform', 'translate('+(imgLeft)+', '+imgTop1+')')
      .style('opacity', 0)
      .attr('fill', color)
      .transition()
      .delay(i*50)
      .style('opacity', 1)
      .attr('transform', 'translate('+(imgLeft)+', '+imgTop2+')')
      .each('end', function() {
        self._animatedMarkers--;
        if (self._animatedMarkers <= 0 && typeof(callback) == 'function') {
          callback();
        }
      });
  }
})();
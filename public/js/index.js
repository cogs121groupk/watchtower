(function($) {
  "use strict";

  var data = [
    { name: "Lolita's", rating: 7.5, pictures: 3 },
    { name: "Lucha Libre", rating: 8, pictures: 5 },
    { name: "Puesto", rating: 9.5, pictures: 10 },
    { name: "Rubio's", rating: 4, pictures: 8 },
    { name: "Taco Bell", rating: 3, pictures: 7 },
    { name: "Taco Stand", rating: 8.5, pictures: 2 },
    { name: "Taco's, El Gordo", rating: 9, pictures: 9 },
    { name: "Oscar's", rating: 9, pictures: 5 },
    { name: "Rigoberto's", rating: 6, pictures: 3 },
    { name: "Galaxy Taco", rating: 6.5, pictures: 1 },
  ];

  // var data = d3.nest()
  //     .key(function(d) {return d.activity_date;})
  //     .sortKeys(d3.ascending)
  //     .entries(data);
  //     console.log("Data", data);

  // Defining the margins and chart size
  var margin = {top: 20, right: 10, bottom: 100, left: 60},
      width = 960 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;
      // that = this;

  var innerWidth  = width  - margin.left - margin.right;
  var innerHeight = height - margin.top  - margin.bottom;

  // TODO: Input the proper values for the scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2);
  var yScale = d3.scale.linear().range([height, 0]);
  // var color = d3.scale.ordinal()
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var color = d3.scale.category20(); // Preset category of colors

  // Define the chart
  var stackBarChart = d3
    .select("#stackBarChart")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

  color.domain(d3.keys(data[0]).filter(function (key) {
    return key !== "name";
  }));

  data.forEach(function (d) {
    var y0 = 0;

    d.rates = color.domain().map(function (type) {
      return {
        type: type,
        y0: y0,
        y1: y0 += +d[type]
      };
    })
    d.total = d.rates[d.rates.length - 1].y1;

    // d.rates.forEach(function (d) { // Leave these 4 lines out
    //   d.y0 /= y0;
    //   d.y1 /= y0;
    // });
    // console.log("y0 is " + d.y0);
  });

  // data.sort(function (a, b) {
  //   return b.rates[0].y1 - a.rates[0].y1;
  // });

  // Render the chart
  xScale.domain(data.map(function (d){ return d.name; }));

  // TODO: Fix the yScale domain to scale with any ratings range
  // yScale.domain([0, 10]);
  yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

  // Note all these values are hard coded numbers
  // TODO:
  // 1. Consume the taco data
  // 2. Update the x, y, width, and height attributes to appropriate reflect this
  stackBarChart
    .selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return xScale(d.name); })
    .attr("width", xScale.rangeBand())
    .attr("y", function(d) { return yScale(d.total); })
    .attr("height", function(d) { return height - yScale(d.total); });
    
  // Orient the x and y axis
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // TODO: Append X axis
  stackBarChart
    .append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
        // .attr("stroke", "#EEEEEE")
        // .attr("fill", "#EEEEEE")
    .selectAll(".xaxis text") // To rotate axis text
        .style("text-anchor", "end")
        .attr("dx", "-1em")
        .attr("dy", ".3em")
        .attr("transform", "rotate(-65)");

  // TODO: Append Y axis
  stackBarChart
    .append("g")
    .attr("class", "yaxis axis")
    .call(yAxis);
        // .attr("stroke","#EEEEEE")
        // .attr("fill", "#EEEEEE");

  var name = stackBarChart.selectAll(".name")
    .data(data)
    .enter().append("g")
    .attr("class", "name")
    .attr("transform", function(d) {
      return "translate(" + xScale(d.name) + ",0)";
  });

  // For stacked
  var dynamicColor;
  name.selectAll("rect")
    .data(function(d) { return d.rates; })
    .enter().append("rect")
    .attr("width", xScale.rangeBand())
    .attr("y", function(d) { return yScale(d.y1); })
    .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
    .style("fill", function(d) { return color(d.type); })
    .on("mouseover", function(d) {
        var total_amt = d.y1 - d.y0;
        console.log('----');

        dynamicColor = this.style.fill;
        d3.select(this)
          .style("fill-opacity", "0.1")
          .style("fill", "#EEEEEE");
          // .append("title")
          // .html(total_amt);
          // .html('Amount: <strong>$' + that.numberWithCommas(total_amt.toFixed(2)) + '</strong>');
        stackBarChart
          .append("text")
          .attr("id", "hoverText")
          .attr("x", width/2)
          .attr("y", height/5)
          .text(function(d) { return total_amt; })
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("fill", dynamicColor)
          .style("fill-opacity", "1");
        stackBarChart
          .select("#hoverText").remove();
    });


  // ASSIGNMENT PART 1B
  // Grab the delphi data from the server

  d3.json("/getAllCrimeData", function(err, data) {
      if (err) {
          console.log(err);
          return;
      }
      console.log("Data", data);
      
  });

  //Get request to update map
  var time = 18;

  $.get("/getTimeTypeCrimeData?time="+time, function(err, data){
      if (err) {
          console.log(err);
          return;
      }
      console.log("Data", data);
  });

  // d3.json("/delphidata", function(err, data) {
  //     if (err) {
  //         console.log(err);
  //         return;
  //     }
  //     // console.log("Data", data);
  //     // Define the chart
  //     var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  //     var yScale = d3.scale.linear().range([height, 0]);

  //     var chart = d3
  //                   .select(".chart2")
  //                   .append("svg")
  //                   .attr("width", width + margin.right + margin.left)
  //                   .attr("height", height + margin.top + margin.bottom)
  //                   .append("g")
  //                   .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

  //     // Render the chart
  //     xScale.domain(data.map(function (d){ return d.gender; }));

  //     // TODO: Fix the yScale domain to scale with any ratings range
  //     yScale.domain([0, d3.max(data, function(d) { return d.number_of_respondents; })]);

  //     chart
  //       .selectAll(".bar")
  //       .data(data)
  //       .enter().append("rect")
  //       .attr("class", "bar")
  //       .attr("x", function(d, i) { return xScale(d.gender); })
  //       .attr("width", xScale.rangeBand())
  //       .attr("y", function(d) { return yScale(d.number_of_respondents); })
  //       .attr("height", function(d) { return height - yScale(d.number_of_respondents); });

  //     // Orient the x and y axis
  //     var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  //     var yAxis = d3.svg.axis().scale(yScale).orient("left");

  //     // TODO: Append X axis
  //     chart
  //       .append("g")
  //       .attr("class", "xaxis axis")
  //       .attr("transform", "translate(0," + height + ")")
  //       .call(xAxis);


  //     // TODO: Append Y axis
  //     chart
  //       .append("g")
  //       .call(yAxis);

  //     chart
  //     .selectAll(".xaxis text")  // select all the text elements for the xaxis
  //     .attr("transform", function(d) {
  //        return "translate(" + this.getBBox().height*-2 + "," + (this.getBBox().height*2) + ")rotate(-45)";
  //     });
  // });  

}) ($);
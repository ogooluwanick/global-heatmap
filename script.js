const colorbrewer = {
        RdYlBu: {
          3: ['#fc8d59', '#ffffbf', '#91bfdb'],
          4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
          5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
          6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
          7: ['#d73027','#fc8d59','#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4'],
          8: [ '#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
          9: [ '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
          10: [ '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
          11: [ '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        },
        RdBu: {
          3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
          4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
          5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
          6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
          7: [ '#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'],
          8: [ '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
          9: [ '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
          10: [ '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
          11: [ '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061']
        }
      };

const section=d3.select("body")
                                .append("section")

const header=section.append("header")

const tooltip = d3.select('body')
                           .append('div')
                           .attr('id', 'tooltip')
                           .style('opacity', 0);                     


d3.json(  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
                .then((data)=>{
                        data.monthlyVariance.forEach(item=>{
                                item.month -= 1
                        })

                        const width=5 * Math.ceil(data.monthlyVariance.length / 12), height=35 * 12

                        const svg = section.append("svg")
                                        .attr("width", width+100)
                                        .attr("height", height+200)
                                        .attr("id","svgContainer")

                        header.append("h1")
                                        .attr("id","title")
                                        .text("Monthly Global Land-Surface Temperature")

                        header.append("h3")
                                        .attr("id","description")
                                        .html(
                                                `
                                                     ${data.monthlyVariance[0].year +" - "+data.monthlyVariance[data.monthlyVariance.length-1].year }: base temperature ${data.baseTemperature}℃  
                                                `
                                        )
                        
                        const yScale=d3.scaleBand()
                                                        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                                                        .rangeRound([0, height])
                                                        .padding(0);
                                
                        const yAxis = d3.axisLeft()
                                                        .scale(yScale)
                                                        .tickValues(yScale.domain())
                                                        .tickFormat( (month)=> {
                                                          let date = new Date(0)
                                                          date.setUTCMonth(month)
                                                          let format = d3.timeFormat("%B")
                                                          return format(date)
                                                        })
                                                        .tickSize(10, 1);

                        svg.append("g")
                                .attr("id","y-axis")
                                .attr("transform", "translate(" + 90 + "," + 50 + ")")
                                .call(yAxis)
                                .append("text")
                                .text("Months")
                                .style("font-size",16)
                                .attr("transform", "rotate(-90),translate(" + -200 + "," + -70 + ")")
                                .attr("fill", "black")

                                const xScale = d3.scaleBand()
                                                                .domain(        
                                                                        data.monthlyVariance.map(function (val) {
                                                                                return val.year;
                                                                })
                                                                )
                                                                .range([0, width])
                                                                .padding(0)

                                const xAxis = d3.axisBottom()
                                                                .scale(xScale)
                                                                .tickValues(
                                                                xScale.domain().filter(function (year) {
                                                                        // set ticks to years divisible by 10
                                                                        return year % 10 === 0;
                                                                })
                                                                )
                                                                .tickFormat(function (year) {
                                                                const date = new Date(0);
                                                                date.setUTCFullYear(year);
                                                                const format = d3.timeFormat("%Y");
                                                                return format(date);
                                                                })
                                                                .tickSize(10, 1);


                        svg.append("g")
                                .attr("id","x-axis")
                                .attr("transform", `translate(90  , ${height+50}  )`)
                                .call(xAxis)
                                .append("text")
                                .text("Years")
                                .attr("transform",`translate(${width/2 -30},${50})`)
                                .style("fill","black")
                                .style("font-size",16)

                        let legendColors = colorbrewer.RdYlBu[11].reverse();
                        let legendWidth = 400;
                        let legendHeight = 300 / legendColors.length;
                        
                        let variance = data.monthlyVariance.map( (val)=> {
                                return val.variance;
                        });
                        let minTemp = data.baseTemperature + Math.min.apply(null, variance);
                        let maxTemp = data.baseTemperature + Math.max.apply(null, variance);

                        let legendThreshold = d3.scaleThreshold()
                                                                                .domain(
                                                                                (function (min, max, count) {
                                                                                        let array = [];
                                                                                        let step = (max - min) / count;
                                                                                        let base = min;
                                                                                        for (let i = 1; i < count; i++) {
                                                                                        array.push(base + i * step);
                                                                                        }
                                                                                        return array;
                                                                                })(minTemp, maxTemp, legendColors.length)
                                                                                )
                                                                                .range(legendColors)


                        let legendX = d3.scaleLinear()
                                                                .domain([minTemp, maxTemp])
                                                                .range([0, legendWidth]);

                        let legendXAxis = d3.axisBottom()
                                                                        .scale(legendX)
                                                                        .tickSize(10, 0)
                                                                        .tickValues(legendThreshold.domain())
                                                                        .tickFormat(d3.format('.1f'));

                        let legend = svg.append('g')
                                                                .classed('legend', true)
                                                                .attr('id', 'legend')
                                                                .attr('transform', 'translate(' + 90 + ',' + (legendHeight+530) + ')')

                        legend.append('g')
                                        .selectAll('rect')
                                        .data(
                                                legendThreshold.range().map(function (color) {
                                                        const d = legendThreshold.invertExtent(color);
                                                        if (d[0] === null) {
                                                        d[0] = legendX.domain()[0];
                                                        }
                                                        if (d[1] === null) {
                                                        d[1] = legendX.domain()[1];
                                                        }
                                                        return d;
                                                })
                                        )
                                        .enter()
                                        .append('rect')
                                        .style('fill', function (d) {
                                                return legendThreshold(d[0]);
                                        })
                                        .attr('x', (d) => legendX(d[0]))
                                        .attr('y', 0)
                                        .attr('width', (d) =>
                                        d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null)
                                        )
                                        .attr('height', legendHeight);

                        legend.append('g')
                                        .attr('transform', 'translate(' + 0 + ',' + (legendHeight) + ')')
                                        .call(legendXAxis);
                                        


                                        svg.append('g')
                                                .classed('map', true)
                                                .attr('transform', 'translate(' + 90    + ',' + 50 + ')')
                                                .selectAll('rect')
                                                .data(data.monthlyVariance)
                                                .enter()
                                                .append('rect')
                                                .attr('class', 'cell')
                                                .attr('data-month', function (d) {
                                                        return d.month;
                                                })
                                                .attr('data-year', function (d) {
                                                        return d.year;
                                                })
                                                .attr('data-temp', function (d) {
                                                        return data.baseTemperature + d.variance;
                                                })
                                                .attr('x', (d) => xScale(d.year))
                                                .attr('y', (d) => yScale(d.month))
                                                .attr('width', (d) => xScale.bandwidth(d.year))
                                                .attr('height', (d) => yScale.bandwidth(d.month))
                                                .attr('fill', function (d) {
                                                        return legendThreshold(data.baseTemperature + d.variance);
                                                })
                                                .on('mouseover', function (event, d) {
                                                        let date = new Date(d.year, d.month);
                                                        let str =
                                                        "<span class='date'>" +
                                                        d3.timeFormat('%Y - %B')(date) +
                                                        '</span>' +
                                                        '<br />' +
                                                        "<span class='temperature'>" +
                                                        d3.format('.1f')(data.baseTemperature + d.variance) +
                                                        '&#8451;' +
                                                        '</span>' +
                                                        '<br />' +
                                                        "<span class='variance'>" +
                                                        d3.format('+.1f')(d.variance) +
                                                        '&#8451;' +
                                                        '</span>';
                                                        tooltip.attr('data-year', d.year);
                                                        tooltip.transition().duration(200).style('opacity', 0.8);
                                                        tooltip.html(str)
                                                                .style('left', event.pageX +10+ 'px')
                                                                .style('top', event.pageY - 28 + 'px');
                                                })
                                                .on('mouseout', ()=>{
                                                        tooltip.transition()
                                                        .duration(400)
                                                        .style("opacity", 0);
                                                });
                                    

                                
                })
                .catch((error)=>alert(error))
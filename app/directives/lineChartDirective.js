wo5App.directive("lineChart", function () {
    return {
        restrict: 'E',
        scope: {
            val: '=',
            grouped: '='
        },
        link: function (scope, element, attrs) {
            var data = [
                {date: '01-01-11', weight: 25 },
                { date: '03-01-11', weight: 27.5 },
                { date: '05-01-11', weight: 30 },
                { date: '09-01-11', weight: 35 },
                { date: '11-01-11', weight: 35 },
                { date: '18-01-11', weight: 32.5 },
                { date: '22-01-11', weight: 35 },
                { date: '29-01-11', weight: 40 },
                { date: '31-01-11', weight: 45 },
                { date: '05-02-11', weight: 47 },
                { date: '10-02-11', weight: 48 },
                { date: '12-02-11', weight: 50 }];
           

            var h = 500;
            var w = 300;
          
            var chart = d3.select(element[0])
                .append("svg")
                .attr("height", h)
                .attr("width", w);

           

            var parseDate = d3.time.format("%d-%m-%y").parse;
          
            var minDate = parseDate(data[0].date),
                maxDate = parseDate(data[data.length - 1].date);
                minWeight = d3.min(data.map(function (d) { return d.weight; }))
                maxWeight = d3.max(data.map(function (d) { return d.weight; }))


            var x = d3.time.scale.utc().domain([minDate, maxDate])
               .range([50, w - 20]);
          
           
            var y = d3.scale.linear().domain([minWeight, maxWeight + 10])
                // bottom / top
                .range([h -60,10]);
            //.range([h - 40, -10]);
                      

            function cx(d) {
                return x(parseDate(d.date));
            }

            function cy(d) {
                return y(d.weight);
            }

            var line = d3.svg.line()			
			    .x(function (d) {			       
			        return x(parseDate(d.date));
			    })
			    .y(function (d) {			   
			        return y(d.weight);
			    })         

            chart.selectAll("circle")
                 .data(data)
                 .enter().append("circle")
                 .attr("fill", "red")
                 .attr("r", 5)
                 .attr("cx", cx)
                 .attr("cy", cy);     

            var xAxis = d3.svg.axis().scale(x).tickFormat(d3.time.format("%d-%m-%y"));
            chart.append('g').call(xAxis)
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + 440 + ')')
            .selectAll("text")
                 .style("text-anchor", "end")
                 .attr("dx", "-0.8em")
                 .attr("dy", "-0.4em")
                 .attr("transform", function (d) {
                     return "rotate(-90)"
                 });


            var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w);
            chart.append("g")
                .attr('class', 'y axis')
                .attr('transform', 'translate(25,0)')
                .call(yAxis);

            chart.append('svg:path').attr('d', line(data));
        }
    }
});
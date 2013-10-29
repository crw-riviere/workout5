wo5App.directive("exerciseLineChart", function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('data', function (newValue, oldValue) {
                return scope.render(newValue);
            }, true);

            var h = 500;
            var w = 300;

            var chart = d3.select(element[0])
                .append("svg")
                .attr("height", h)
                .attr("width", w);

            scope.render = function (data) {
                if (!data || data.sets.length <= 0)
                { return; }

                var parseDate = d3.time.format("%d-%m-%y").parse;

                var minDate = parseDate(data.sets[0].date),
                    maxDate = parseDate(data.sets[data.sets.length - 1].date);
                minPerform = d3.min(data.sets.map(function (d) { return d.perform; }))
                maxPerform = d3.max(data.sets.map(function (d) { return d.perform; }))

                if (maxPerform < data.target.perform) {
                    maxPerform = data.target.perform;
                }

                var x = d3.time.scale.utc().domain([minDate, maxDate])
                   .range([50, w - 20]);

                var y = d3.scale.linear().domain([minPerform, maxPerform + 10])
                    // bottom / top
                    .range([h - 60, 10]);

                function cx(d) {
                    return x(parseDate(d.date));
                }

                function cy(d) {
                    return y(d.perform);
                }

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(parseDate(d.date));
                    })
                    .y(function (d) {
                        return y(d.perform);
                    })

                chart.selectAll("circle")
                     .data(data.sets)
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

                chart.append('svg:path').attr('d', line(data.sets));
            }
        }
    }
});
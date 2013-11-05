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

            //var h = 500;
            //var w = 300;

            var m = { top: 30, right: 10, bottom: 100, left: 30 };
            var h = 500 - m.top - m.bottom;

            var chart = d3.select(element[0])
           .append('svg')
           .attr('width', '100%')
           .attr('height', h + m.top + m.bottom)
           .append('g')
           .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

            window.onresize = function () {
                scope.$apply();
            };

            scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
            }, function () {
                scope.render(scope.data);
            });

            scope.render = function (data) {
                chart.selectAll('*').remove();

                if (!data || data.sets.length <= 0)
                { return; }

                var w = d3.select(element[0]).node().offsetWidth - m.left - m.right;

                var parseDate = d3.time.format("%d-%m-%y %H:%M:%S").parse;

                var minDate = parseDate(data.sets[0].date),
                    maxDate = parseDate(data.sets[data.sets.length - 1].date);
                minPerform = d3.min(data.sets.map(function (d) { return d.perform; }))
                maxPerform = d3.max(data.sets.map(function (d) { return d.perform; }))

                if (maxPerform < data.target.perform) {
                    maxPerform = data.target.perform;
                }

                var x = d3.time.scale.utc().domain([minDate, maxDate])
                   .range([m.left, w]);

                var y = d3.scale.linear().domain([minPerform, maxPerform + 10])
                    // bottom / top
                    .range([h, 0]);

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

                var xAxis = d3.svg.axis().scale(x).tickFormat(d3.time.format("%d-%m-%y"));
                chart.append('g').call(xAxis)
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (h + 10) + ')')
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
                    //.attr('transform', 'translate(25,0)')
                    .call(yAxis);

                chart.append('svg:path').attr('d', line(data.sets));

                chart.selectAll("circle")
                    .data(data.sets)
                    .enter().append("circle")
                    .attr("fill", "red")
                    .attr("r", 5)
                    .attr("cx", cx)
                    .attr("cy", cy);
            }
        }
    }
});
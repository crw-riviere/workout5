wo5App.directive('sessionLineChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('data', function (newValue, oldValue) {
                return scope.render(newValue);
            }, true);

            //var m = { top: 30, right: 10, bottom: 30, left: 30 };
            //var h = 150 - m.top - m.bottom;
            //var w = d3.select(element[0]).node().offsetWidth - m.left - m.right;

            var m = { top: 30, right: 10, bottom: 30, left: 30 };
            var h = 150 - m.top - m.bottom;

            var chart = d3.select(element[0])
             .append('svg')
             .attr('width', '100%')
             .attr('height', h + m.top + m.bottom)
             .append('g')
             .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

            //   var chart = d3.select(element[0])
            // .append('svg')
            //.attr('width', '100%')
            // //.attr('width', w + m.left + m.right)
            // .attr('height', h + m.top + m.bottom)
            // .append('g')
            // .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

            window.onresize = function () {
                scope.$apply();
            };

            scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
            }, function () {
                scope.render(scope.data);
            });

            scope.render = function (data) {
                chart.selectAll("*").remove();

                if (!data || data.sets.length <= 0)
                { return; }

                var w = d3.select(element[0]).node().offsetWidth - m.left - m.right;

                var
                    minSet = d3.min(data.sets.map(function (d) { return d.no; }))
                maxSet = d3.max(data.sets.map(function (d) { return d.no; }))
                minPerform = d3.min(data.sets.map(function (d) { return d.perform; }))
                maxPerform = d3.max(data.sets.map(function (d) { return d.perform; }))

                var x = d3.scale.linear().domain([minSet, maxSet])
                .range([m.left, w]);

                var y = d3.scale.linear().domain([minPerform, maxPerform + 10])
                    // bottom / top
                    .range([h, 0]);

                function cx(d) {
                    return x(d.no);
                }

                function cy(d) {
                    return y(d.perform);
                }

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.no);
                    })
                    .y(function (d) {
                        return y(d.perform);
                    })

                var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(d3.format('d')).tickValues(data.sets.map(function (d) { return d.no; }));
                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (h + 10) + ')')
                    .call(xAxis);

                var yAxis = d3.svg.axis().scale(y).orient('left').ticks(4).tickSize(-w);

                chart.append('g')
                    .attr('class', 'y axis')
                    //.attr('transform', 'translate(' + m.left + ',0)')
                    .call(yAxis);

                chart.append('text')
                .attr('y', h + 10)
                .attr('x', 0 - m.right)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .attr('font-size', '10px')
                .text('(kgs)');

                chart.append('svg:path').attr('d', line(data.sets));

                chart.selectAll('circle')
                    .data(data.sets)
                    .enter().append('circle')
                    .attr('fill', 'red')
                    .attr('r', 5)
                    .attr('cx', cx)
                    .attr('cy', cy);
            }
        }
    }
});
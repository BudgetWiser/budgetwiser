var budgetMap = {};

budgetMap.getdata = function(get_url){
    $.ajax({
        type: 'GET',
        url: get_url,
        dataType: 'json',
        crossDomain: true,
        success: function(resObj){
            budgetMap.make(resObj);
        },
        error: function(xhr){
            console.log('error');
        }
    });
};

budgetMap.make = function(data){
    var diameter = 960,
        format = d3.format(",d");

    var color = d3.scale.threshold()
        .domain([-0.25, -0.05, 0, .25, .05, 1])
        //.domain([5, 10, 15, 20, 25, 100])
        .range(["rgb(216, 75, 42)", "rgb(238, 149, 134)", "rgb(228, 183, 178)", "rgb(190, 204, 174)", "rgb(156, 175, 132)", "rgb(122, 162, 92)", "#fff"]);

    var pack = d3.layout.pack()
        .size([diameter - 4, diameter - 4])
        .value(function(d) { return d.size; });

    var svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
      .append("g")
        .attr("transform", "translate(2,2)");

    var root = data;
    var node = svg.datum(root).selectAll(".node")
        .data(pack.nodes)
        .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.rate ? d.rate : 2); });


    node.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });

    d3.select(self.frameElement).style("height", diameter + "px");
};

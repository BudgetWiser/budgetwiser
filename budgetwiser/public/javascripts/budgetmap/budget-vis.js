// requires d3.js and d3.layout.js
var BudgetVis = function(){
	
};

BudgetVis.prototype.generate = function(settings){
	var w = settings.size.width,
	h = settings.size.height,
	r = this.radius  = settings.size.radius,
	x = this.x = d3.scale.linear().range([0, r]),
	y = this.y = d3.scale.linear().range([0, r]);

	var pack = d3.layout.pack()
	.size([r, r])
	.value(function(d) { return d.size; })

    var color = d3.scale.threshold()
        .domain([-0.25, -0.05, 0, .25, .05, 1])
        //.domain([5, 10, 15, 20, 25, 100])
        .range(["rgb(216, 75, 42)", "rgb(238, 149, 134)", "rgb(228, 183, 178)", "rgb(190, 204, 174)", "rgb(156, 175, 132)", "rgb(122, 162, 92)"]);

	var vis = this.vis = settings.container.append("svg")
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

	var data = settings.data;

	this.node = this.root = data;
	this.selected = null;

	var self = this;

	var nodes = pack.nodes(this.root);

	vis.selectAll("circle")
	.data(nodes)
	.enter().append("svg:circle")
	.attr("class", function(d) { return d.children ? "parent" : "child"; })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d) { return d.r; })
	.attr("fill", function(d) { return d.rate ? color(d.rate) : "aliceblue"; })
	.on("click", function(d) { 
		//currently only the leaf node can be selected
		if (d.children==undefined){
			if (self.selected ){//deselect
				d3.select(self.selected).attr("fill", color(d.rate));
			}
			if (self.selected == this){
				self.selected = null;
			}else{
				self.selected = this;
				d3.select(self.selected).attr("fill", "Chartreuse");
				settings.onSelect(d); // call selection callback
			}
		}
		// currently no zomming support for leaf node
		if (typeof d.children != "undefined") {
			self.zoom(self.node == d ? self.root : d); 
		}
		d3.event.stopPropagation();
	});

	vis.selectAll("text")
	.data(nodes)
	.enter().append("svg:text")
	.attr("class", function(d) { return d.children ? "parent" : "child"; })
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
	.text(function(d) { return d.name; });

	d3.select(window).on("click", function() { self.zoom(this.root); });
}

BudgetVis.prototype.zoom = function(d, i) {
	var k = this.radius / d.r / 2;
	var x = this.x;
	var y = this.y;
	var vis = this.vis;

	x.domain([d.x - d.r, d.x + d.r]);
	y.domain([d.y - d.r, d.y + d.r]);

	var t = vis.transition()
	.duration(d3.event.altKey ? 7500 : 750);

	t.selectAll("circle")
	.attr("cx", function(d) { return x(d.x); })
	.attr("cy", function(d) { return y(d.y); })
	.attr("r", function(d) { return k * d.r; });

	t.selectAll("text")
	.attr("x", function(d) { return x(d.x); })
	.attr("y", function(d) { return y(d.y); })
	.style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

	this.node = d;
	d3.event.stopPropagation();
}


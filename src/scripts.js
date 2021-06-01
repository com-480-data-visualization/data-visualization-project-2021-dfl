let dataByGas = {};

function displayAreaChart() {
	const PATH = "data/unfcc/time_series"

	// prepare the data here
	d3.queue()
	// Time Series - CO₂ total with LULUCF, in kt.csv
	
	.defer(d3.csv, PATH + "/data_by_gas/Time Series - CO₂ total with LULUCF, in kt.csv", function(row) {
			dataByGas[row.Party] = {"CO2_LULU": []};
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CO2_LULU"].push(row[key]);
				}		
			}
		})
		// Time Series - CO₂ total without LULUCF, in kt.csv
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CO₂ total without LULUCF, in kt.csv", function(row) {
			dataByGas[row.Party]["CO2"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CO2"].push(row[key]);
				}		
			}
		})
		// Time Series - CH₄ total with LULUCF, in kt CO₂ equivalent.csv
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CH₄ total with LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["CH4_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CH4_LULU"].push(row[key]);
				}		
			}
		})
		// Time Series - CH₄ total without LULUCF, in kt CO₂ equivalent.csv
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CH₄ total without LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["CH4"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CH4"].push(row[key]);
				}		
			}
		})
		// Time Series - N₂O total with LULUCF, in kt CO₂ equivalent.csv
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - N₂O total with LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["N20_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["N20_LULU"].push(row[key]);
				}		
			}
		})
		// Time Series - N₂O total without LULUCF, in kt CO₂ equivalent.csv
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - N₂O total without LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["N2O"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["N2O"].push(row[key]);
				}		
			}
		})
		.await(ready); // Once the loading is over, we enter the ready function that takes care of the plotting
	
	
		// Function executed after data has been loaded:
		function ready(error, topo) {
			if (error) throw error;
			// console.log("data_gas: ", dataByGas);

			let countries = getAllCountries(dataByGas);
			let select = document.getElementById("countryDropdown"); 
		
			// populate dropdown menu
			for(var i = 0 ; i < countries.length ; i++) {
					var opt = countries[i];
					var li = document.createElement("li");
					var link = document.createElement("a");
					var text = document.createTextNode(opt);
					link.appendChild(text);
					link.classList.add('dropdown-item');
					link.href = "#";
					li.appendChild(link);
					select.appendChild(li);
			}
		
			country = "United States of America";
			loadAreaChart(country);
		
			// plot line based on selected country
			$('#countryDropdown li').on('click', function(){
				country = $(this).text();
				loadAreaChart(country);
			});
		}
	}


/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		console.log("ACTION");
		// `DOMContentLoaded` already fired
		action();
	}
	


}


const MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };

class ScatterPlot {
	constructor(svg_element_id, data, data1, data2, data3, country, gas) {
		const height = 400;
		const width = 600;

		this.country = country;
		this.gas = gas;
		this.data = data;
		this.data1 = data1;
		this.data2 = data2;
		this.data3 = data3;
		

		this.svg = d3.select('#' + svg_element_id)
		.attr("width", width + MARGIN.left + MARGIN.right)
		.attr("height", height + MARGIN.top + MARGIN.bottom)
		.append("g")
		.attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);


		this.svg = this.svg.append('g');

		const x_value_range = [d3.min(data, d => d.date), d3.max(data, d => d.date)];
		const y_value_range = [0, 1.2 * d3.max(data, d => parseInt(d.y))];

		const xScale = d3.scaleTime()
			.domain(x_value_range)
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([height, 0]);

		// scatter plot
		this.svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("r", 2) // radius
				.attr("cx", d => xScale(d.date)) // position, rescaled
				.attr("cy", d => yScale(d.y));
			
				
		// line plot
		// this.svg.append("path")
		// .datum(data)
		// .attr("stroke", "black")
		// .style("fill", "none")
		// .attr("stroke-width", 0.5)
		// .attr("d", d3.line()
		// 	.x(function(d) { return xScale(d.date) })
		// 	.y(function(d) { return yScale(d.y) }))

		// area plot
		this.svg.append("path")
		.datum(this.data)
		// .attr("data-legend",gas)
		.attr("fill", color)
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg.append("path")
		.datum(this.data1)
		// .attr("data-legend","CO2 emissions")
		.attr("fill", "#122f57")
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg.append("path")
		.datum(this.data2)
		.attr("fill", "#2e516f")
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg.append("path")
		.datum(this.data3)
		.attr("fill", "#3b7681")
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		// create axis
		const xAxis = d3.axisBottom(xScale);

		this.svg.append("g")
		.attr('class', 'axis')
		.attr('class', 'text')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis)

		const yAxis = d3.axisLeft(yScale);
		this.svg.append("g")
		.attr('class', 'axis')
		.attr('class', 'text')
		.call(yAxis
		// .tickPadding(15)
		.tickFormat(d3.formatPrefix(".1", 1e3)));

		this.svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (MARGIN.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text(this.country + " " + this.gas + " emissions");


		// legend = this.svg.append("g")
		// 	.attr("class","legend")
		// 	.attr("transform","translat100,100)")
		// 	.style("font-size","12px")
		// 	.call(d3.legend)
	};

}


function addScatterPlotLegend() {

}


function getAllCountries(dataByGas) {
	// console.log(dataByGas);	
	countries = [];
	for (const [key, value] of Object.entries(dataByGas)) {
		// console.log(`${key}: ${value}`);
		countries.push(key);
	}
	return countries;

}


function loadGasByCountry(country, gas) {
	// prepare the data here
	
	const VALUES = dataByGas[country][gas];
	// console.log("VALUES: ", VALUES);
	const YEARS = Array.from(Array(29), (elem, index) => 1990 + index);

	/* 
	* convert data into an array where each element is 
	* {'y': value, 'date': year}.
	*/
	var dataArray = [];
	YEARS.forEach(function (year, i) {
		var temp_dict = {};
		temp_dict['y'] = VALUES[i]; 
		temp_dict['date'] = new Date(+year, 0, 1, 0, 0, 0, 0);
		
		dataArray.push(temp_dict);

	})	
	return dataArray;
}


function displayMap() {

	function createMapClick(year) {
		// The svg
		let svg = d3.select("#my_dataviz"),
		width = +svg.attr("width"),
		height = +svg.attr("height");
		
		// Map and projection
		let projection = d3.geoEquirectangular() 
			.scale(100);
		let path = d3.geoPath().projection(projection);
		// Data and color scale
		let data = d3.map();
		let color = d3.scaleSequential()
					  .domain([0, 2000000])
					  .interpolator(d3.interpolateYlGnBu);
		
		
		// Load external data and boot
		d3.queue()
			.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
			.defer(d3.csv, "https://raw.githubusercontent.com/DAL12/Files/master/ghg" + year + ".csv", function(d) { data.set(d.code, +d.emission);})
			.await(ready);
		
		function ready(error, topo) {
		
			if (error) throw error;
		
			// Draw the map
			svg.append("g") 
			.selectAll("path")
			.data(topo.features)
			.enter()
			.append("path")
				// draw each country
				.attr("d", path)
				// set the color of each country
				.attr("fill", function (d) {
				d.total = data.get(d.id) || 0;
				return color(d.total);
				}).style("stroke", "white");
			}  
	}
    // The svg
    let svg = d3.select("#my_dataviz"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    // Map and projection
    let projection = d3.geoEquirectangular() 
        .scale(100);
        //.center([0,20])
        //.translate([width / 2, height / 2]);
    let path = d3.geoPath().projection(projection);
    // Data and color scale
    let data = d3.map();
    let color = d3.scaleSequential()
                  .domain([0, 2000000])
                  .interpolator(d3.interpolateYlGnBu);
    
    
    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "https://raw.githubusercontent.com/DAL12/Files/master/ghg1990.csv", function(d) { data.set(d.code, +d.emission); })
        .await(ready);
    
    // Time slider
    
    var dataTime = d3.range(0, 10).map(function(d) {
    return new Date(1990 + d, 10, 3);
    });
    
    var sliderTime = d3
                    .sliderBottom()
                    .min(d3.min(dataTime))
                    .max(d3.max(dataTime))
                    .step(1000 * 60 * 60 * 24 * 365)
                    .width(600)
                    .tickFormat(d3.timeFormat('%Y'))
                    .tickValues(dataTime)
                    .default(new Date(1990, 10, 3))
					.on('onchange', val => {switchPlots(d3.timeFormat('%Y')(val));});

	function switchPlots(time) {
		// console.log(time)
		createMapClick(time)
	}
    
    var gTime = d3
                .select('div#slider-time')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 100)
                .append('g')
                .attr('transform', 'translate(180,20)');
    
    gTime.call(sliderTime);
    
    
    function ready(error, topo) {
    
        if (error) throw error;
    
        // Draw the map
        svg.append("g") 
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
            // draw each country
            .attr("d", path)
            // set the color of each country
            .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return color(d.total);
            }).style("stroke", "white");
        }   
    
    // legend function
    
      let title = "GHG emissions in kt",
      tickSize = 6,
      w = 320, 
      h = 44 + tickSize,
      marginTop = 18,
      marginRight = 0,
      marginBottom = 16 + tickSize,
      marginLeft = 0,
      ticks = w / 64,
      tickFormat,
      tickValues
    
      const svg_new = d3.select("#legend")
          .attr("width", w)
          .attr("height", h)
          .attr("viewBox", [0, 0, w, h])
          .style("overflow", "visible")
          .style("display", "block")
          .attr("transform", "translate(" + width/6 + "," + height/6 + ")");
    
      let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - h);
      let x;
    
    
      // Sequential
      if (color.interpolator) {
        x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, w - marginRight)),
            {range() { return [marginLeft, w - marginRight]; }});
    
        svg_new.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", w - marginLeft - marginRight)
            .attr("height", h - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());
    
        // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
          if (tickValues === undefined) {
            const n = Math.round(ticks + 1);
            tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
          }
          if (typeof tickFormat !== "function") {
            tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
          }
        }
      }
    
      svg_new.append("g")
          .attr("transform", `translate(0,${h - marginBottom})`)
          .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
          .call(tickAdjust)
          .call(g => g.select(".domain").remove())
          .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - h - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title));
    
    function ramp(color, n = 256) {
      var canvas = document.createElement('canvas');
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
}


function mapProgressBar() {
	// Progress bar
	var svg_bar = d3.selectAll('.prog_bar')
					.append('svg')
					.attr('height', 20)
					.attr('width', 500);
	
	svg_bar.append('rect')
			.attr('class', 'bg-rect')
			.attr('rx', 10)
			.attr('ry', 10)
			.attr('fill', 'lightgray')
			.attr('height', 15)
			.attr('width', 500)
			.attr('x', 0);

	var progress = svg_bar.append('rect')
									.attr('class', 'progress-rect')
									.attr('fill', "darkblue")
									.attr('height', 15)
									.attr('width', 50)
									.attr('rx', 10)
									.attr('ry', 10)
									.attr('x', 0);

	progress.transition()
			.duration(1000)
			.attr('width', 200);
}


function loadAreaChart(country) {

	d3.selectAll("#plot > *").remove();


	gas = "CO2";
	color = "#208cb6";
	data1 = loadGasByCountry(country, gas);
	gas = "CH4";
	data2 = loadGasByCountry(country, gas);
	gas = "N2O";
	data3 = loadGasByCountry(country, gas);

	
	data_total = [];
	data1.forEach(function callback(element, index) {
		// console.log(element, index);
		// console.log("data1[index]: ", data1[index].y);
		// console.log("data1[index]: ", data1[index].date);
		y_total = parseInt(data1[index].y) + parseInt(data2[index].y) + parseInt(data3[index].y);

		data_total.push({y: y_total, date: data1[index].date});
	})
	// console.log("data_total: ", data_total);


	gas = "GHG Total";
	color = "#13243c";

	data = loadGasByCountry(country, "CO2");
	new ScatterPlot('plot', data_total, data1, data2, data3, country, gas, color);
}

whenDocumentLoaded(() => {
	displayMap();
	mapProgressBar();
	displayAreaChart();
});




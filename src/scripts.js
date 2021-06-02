let dataByGas = {};
let countryCodeName = {};
let areaChart;

function displayAreaChart() {
	const PATH = "data/unfcc/time_series"

	// prepare the data here
	d3.queue()
	.defer(d3.csv, PATH + "/data_by_gas/Time Series - CO₂ total with LULUCF, in kt.csv", function(row) {
			dataByGas[row.Party] = {"CO2_LULU": []};
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CO2_LULU"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CO₂ total without LULUCF, in kt.csv", function(row) {
			dataByGas[row.Party]["CO2"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CO2"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CH₄ total with LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["CH4_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CH4_LULU"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - CH₄ total without LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["CH4"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["CH4"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - N₂O total with LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["N20_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["N20_LULU"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_by_gas/Time Series - N₂O total without LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["N2O"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["N2O"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, "data/country_codes.csv", function(row) {
			// ISO 3166-1 alpha-3 codes data from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
			countryCodeName[row.Code] = row.Name;
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
			
			// load default country when site loads
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


const MARGIN = { top: 50, right: 170, bottom: 50, left: 50 };

class AreaChart {
	constructor(svg_element_id, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country) {
		const height = 400;
		const width = 600;

		this.country = country;
		this.total_emissions = total_emissions;
		this.co2_emissions = co2_emissions;
		this.ch4_emissions = ch4_emissions;
		this.n2o_emissions = n2o_emissions;

		// create a list of keys
		let keys = ["Total emissions", "CO2 emissions", "CH4 emissions", "N2O emissions"]

		let areaChartColors = d3.scaleOrdinal()
			.domain(keys)
			.range(["#13243c", "#122f57", "#2e516f", "#3b7681"])

		this.svg = d3.select('#' + svg_element_id)
			.attr("width", width + MARGIN.left + MARGIN.right)
			.attr("height", height + MARGIN.top + MARGIN.bottom)
			.append("g")
			.attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

		this.svg = this.svg.append('g');

		// const x_value_range = [d3.min(total_emissions, d => d.date), d3.max(total_emissions, d => d.date)];
		const x_value_range = [d3.min(total_emissions, d => d.date), new Date(2020, 0, 1, 0, 0, 0, 0)];
		const y_value_range = [0, 1.2 * d3.max(total_emissions, d => parseInt(d.y))];

		const xScale = d3.scaleTime()
			.domain(x_value_range)
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([height, 0]);

		// scatter plot
		// this.svg.selectAll("circle")
		// 	.data(total_emissions)
		// 	.enter()
		// 	.append("circle")
		// 		.attr("r", 2) // radius
		// 		.attr("cx", d => xScale(d.date)) // position, rescaled
		// 		.attr("cy", d => yScale(d.y));
			
				
		// line plot
		// this.svg.append("path")
		// .datum(total_emissions)
		// .attr("stroke", "black")
		// .style("fill", "none")
		// .attr("stroke-width", 0.5)
		// .attr("d", d3.line()
		// 	.x(function(d) { return xScale(d.date) })
		// 	.y(function(d) { return yScale(d.y) }))


		// area plot
		this.svg_total_emissions = this.svg.append("path")
		.datum(this.total_emissions)
		.attr("fill", areaChartColors("Total emissions"))
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("class", "myArea total_emissions")
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date)	})
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg_co2_emissions = this.svg.append("path")
		.datum(this.co2_emissions)
		.attr("fill", areaChartColors("CO2 emissions"))
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("class", "myArea co2_emissions")
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg_ch4_emissions = this.svg.append("path")
		.datum(this.ch4_emissions)
		.attr("fill", areaChartColors("CH4 emissions"))
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("class", "myArea ch4_emissions")
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		this.svg_n2o_emissions = this.svg.append("path")
		.datum(this.n2o_emissions)
		.attr("fill", areaChartColors("N2O emissions"))
		.attr("stroke", "#69b3a2")
		.attr("stroke-width", 1.5)
		.attr("class", "myArea n2o_emissions")
		.attr("d", d3.area()
			.x(function(d) { return xScale(d.date) })
			.y0(yScale(0))
			.y1(function(d) { return yScale(d.y) })
			)

		// print lines for the kyoto commitments
		let kp_beginning = new Date(2008, 0, 1, 0, 0, 0, 0);
		let kp_commitment_1 = new Date(2013, 0, 1, 0, 0, 0, 0);
		let kp_commitment_2 = new Date(2020, 0, 1, 0, 0, 0, 0);


		// Beginning of Kyoto protocol phases
		this.svg.append("line")
			.attr("x1", xScale(kp_beginning))  
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_beginning))  
			.attr("y2", height)
			.attr("class", "kyoto-begining-lines")

		this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_beginning)})
			.attr("class", "kyoto-commitment-labels")
			.text("KP Beginning");

		// Line for Kyoto 1st commitment
		this.svg.append("line")
			.attr("x1", xScale(kp_commitment_1))  
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_commitment_1))  
			.attr("y2", height)
			.attr("class", "kyoto-commitment-lines")

		this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_commitment_1)})
			.attr("class", "kyoto-commitment-labels")
			.text("KP 1st commitment ");

		// Line for Kyoto 2nd commitment
		this.svg.append("line")
			.attr("x1", xScale(kp_commitment_2))
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_commitment_2))
			.attr("y2", height)
			.attr("class", "kyoto-commitment-lines")

		this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_commitment_2)})
			.attr("class", "kyoto-commitment-labels")
			.text("KP 2nd commitment");

		// // Kyoto phase areas
		// let kp_phase_1_data = [
		// 	{y: "8000000", date: new Date(2008, 0, 1, 0, 0, 0, 0) },
		// 	{y: "8000000", date: new Date(2013, 0, 1, 0, 0, 0, 0) }
		// ]

		// this.kp_phase_1 = this.svg.append("path")
		// 	.datum(kp_phase_1_data)
		// 	.attr("fill", "green")
		// 	.attr("fill-opacity","0.1")
		// 	.attr("stroke", "#69b3a2")
		// 	.attr("stroke-width", 0)
		// 	.attr("d", d3.area()
		// 		.x(function(d) { return xScale(d.date) })
		// 		.y0(yScale(0))
		// 		.y1(function(d) { return yScale(d.y) })
		// 		)

		// let kp_phase_2_data = [
		// 	{y: "8000000", date: new Date(2013, 0, 1, 0, 0, 0, 0) },
		// 	{y: "8000000", date: new Date(2020, 0, 1, 0, 0, 0, 0) }
		// ]

		// this.kp_phase_1 = this.svg.append("path")
		// 	.datum(kp_phase_2_data)
		// 	.attr("fill", "green")
		// 	.attr("fill-opacity","0.2")
		// 	.attr("stroke", "#69b3a2")
		// 	.attr("stroke-width", 0)
		// 	.attr("d", d3.area()
		// 		.x(function(d) { return xScale(d.date) })
		// 		.y0(yScale(0))
		// 		.y1(function(d) { return yScale(d.y) })
		// 		)
			
		// create axis
		const xAxis = d3.axisBottom(xScale);
		this.xSvgAxis = this.svg.append("g")
			.attr('class', 'axis')
			.attr('class', 'text')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis)

		const yAxis = d3.axisLeft(yScale);
		this.ySvgAxis = this.svg.append("g")
			.attr('class', 'axis')
			.attr('class', 'text')
			.call(yAxis
			// .tickPadding(15)
			.tickFormat(d3.formatPrefix(".1", 1e3)));

		this.title = this.svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (MARGIN.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text(this.country + " GHG emissions");

		// legend = this.svg.append("g")
		// 	.attr("class","legend")
		// 	.attr("transform","translat100,100)")
		// 	.style("font-size","12px")
		// 	.call(d3.legend)

		//////////////////////////////
    // HIGHLIGHT GROUP //    inspired by https://www.d3-graph-gallery.com/graph/stackedarea_template.html
    //////////////////////////////

    // What to do when one group is hovered
    var highlight = function(d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d.toLowerCase().replace(/ /g,"_")).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".myArea").style("opacity", 1)
    }


		//////////////////////////////
    // LEGEND // 	inspired by https://www.d3-graph-gallery.com/graph/stackedarea_template.html
    //////////////////////////////
		

	// Add one dot in the legend for each name.
		var size = 20
		this.svg.selectAll("mydots")
			.data(keys)
			.enter()
			.append("rect")
				.attr("x", width + 40)
				.attr("y", function(d,i){ return 140 + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
				.attr("width", size)
				.attr("height", size)
				.style("fill", function(d){ return areaChartColors(d)})
				.attr("class", "area-chart-legend")
				.on("mouseover", highlight)
        .on("mouseleave", noHighlight)

		// Add one dot in the legend for each name.
		this.svg.selectAll("mylabels")
			.data(keys)
			.enter()
			.append("text")
				.attr("x", width + 40 + size*1.2)
				.attr("y", function(d,i){ return 140 + i*(size+15) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
				.style("fill", function(d){ return areaChartColors(d) })
				.text(function(d){ return d})
				.attr("text-anchor", "left")
				.attr("font-size", "0.8em")
				.style("alignment-baseline", "middle")
				.attr("class", "area-chart-legend")
				.on("mouseover", highlight)
        .on("mouseleave", noHighlight)
	}

	update(svg_element_id, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country) {
		const height = 400;
		const width = 600;

		// const x_value_range = [d3.min(total_emissions, d => d.date), d3.max(total_emissions, d => d.date)];
		const x_value_range = [d3.min(total_emissions, d => d.date), new Date(2020, 0, 1, 0, 0, 0, 0)];
		const y_value_range = [0, 1.2 * d3.max(total_emissions, d => parseInt(d.y))];

		const xScale = d3.scaleTime()
			.domain(x_value_range)
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([height, 0]);

		
		var t = d3.transition()
			.duration(750)
			.ease(d3.easeLinear);

		
		this.svg.selectAll("circle")
			.data(total_emissions)
			.transition(t)		
			.attr("r", 2) // radius
			.attr("cx", d => xScale(d.date)) // position, rescaled
			.attr("cy", d => yScale(d.y));


		this.svg_total_emissions
			.datum(total_emissions)
			.transition(t)		
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date) })
				.y0(yScale(0))
				.y1(function(d) { return yScale(d.y) })
				)
	
		this.svg_co2_emissions
			.datum(co2_emissions)
			.transition(t)		
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date) })
				.y0(yScale(0))
				.y1(function(d) { return yScale(d.y) })
				)
	
		this.svg_ch4_emissions 
			.datum(ch4_emissions)
			.transition(t)		
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date) })
				.y0(yScale(0))
				.y1(function(d) { return yScale(d.y) })
				)
	
		this.svg_n2o_emissions
			.datum(n2o_emissions)
			.transition(t)		
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date) })
				.y0(yScale(0))
				.y1(function(d) { return yScale(d.y) })
				)

		const xAxis = d3.axisBottom(xScale);
		this.xSvgAxis
			.attr('transform', `translate(0, ${height})`)
			.transition(t)
			.call(xAxis)

		const yAxis = d3.axisLeft(yScale);
		this.ySvgAxis
			.transition(t)
			.call(yAxis
			// .tickPadding(15)
			.tickFormat(d3.formatPrefix(".1", 1e3)));

		this.title
			.transition(t)
			.attr("x", (width / 2))             
			.attr("y", 0 - (MARGIN.top / 2))
			.text(country + " GHG emissions");
	}
}


function addScatterPlotLegend() {

}


function getAllCountries(dataByGas) {
	countries = [];
	for (const [key, value] of Object.entries(dataByGas)) {
		countries.push(key);
	}
	return countries;

}


function loadGasByCountry(country, gas) {
	// prepare the data here
	
	const VALUES = dataByGas[country][gas];
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

	width = 800;
	height = 450;

	function createMapClick(year) {
		
		// The svg
		var svg = d3.select("#map-cont")
				.append("svg")
				.attr("id", "my_dataviz")
				.attr("width", width)
				.attr("height", height);
		
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
			const g = svg.append("g")

			const zoom = d3.zoom()
			.scaleExtent([1, 8])
		    .on('zoom', zoomed);

			svg.call(zoom);

			function zoomed() {
				g.selectAll('path')
				 .attr('transform', d3.event.transform);
			}

			g 
			.selectAll("path")
			.data(topo.features)
			.enter()
			.append("path")
				// draw each country
				.attr("d", path)
				// set the color of each country
				.attr("fill", function (d) {
				if (data.get(d.id)) {
					return color(data.get(d.id));
				}
				else {
					return d3.rgb(220,220,220);
				}
				}).style("stroke", "white")
				.classed("clickable", true)
				.on("click", function(d, i) {
					// load Area Chart for country clicked on map
					loadAreaChart(countryCodeName[d.id]);
				});
			} 
			
	}

	let color = d3.scaleSequential()
					  .domain([0, 2000000])
					  .interpolator(d3.interpolateYlGnBu);

	createMapClick(1990) 
    
    // Time slider
    
    var dataTime = d3.range(0, 29).map(function(d) {
    return new Date(1990 + d, 10, 3);
    });
    
    var sliderTime = d3
                    .sliderBottom()
                    .min(d3.min(dataTime))
                    .max(d3.max(dataTime))
                    .step(1000 * 60 * 60 * 24 * 365)
                    .width(700)
                    .tickFormat(d3.timeFormat('%Y'))
                    .tickValues(dataTime)
                    .default(new Date(1990, 10, 3))
					.on('onchange', val => {switchPlots(d3.timeFormat('%Y')(val));});

	function switchPlots(time) {
		d3.select("#map-cont").select("#my_dataviz").remove();
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
    
    
	//
    
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
	
	// check if country selected on map exist in database
	if (!(country in dataByGas)) {
		alert("Sorry, emissions data for " + country + " is not available.");
		return;
	}

	// load data for different gases
	co2_emissions = loadGasByCountry(country, "CO2");
	ch4_emissions = loadGasByCountry(country, "CH4");
	n2o_emissions = loadGasByCountry(country, "N2O");

	// calculate total emissions by summing all gases
	total_emissions = [];
	co2_emissions.forEach(function callback(element, index) {
		y_total = parseInt(co2_emissions[index].y) + parseInt(ch4_emissions[index].y) + parseInt(n2o_emissions[index].y);
		total_emissions.push({y: y_total, date: co2_emissions[index].date});
	})

	if (!areaChart) {
		// creates a new Area Chart
		d3.selectAll("#plot > *").remove();
		areaChart = new AreaChart('plot', total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country);
	} else {
		// updates existing Area Chart with transitions
		areaChart.update('plot', total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country);
	}
}


whenDocumentLoaded(() => {
	displayMap();
	mapProgressBar();
	displayAreaChart();
});




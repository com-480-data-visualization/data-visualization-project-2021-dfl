///////////////////////////////////////////////////////////
//////////				  	AREA CHART SECTION 				 ////////// 
/////////////////////////////////////////////////////////// 

let dataByGas = {};
let countryCodeName = {};
let areaChart;
let x_value_range = [new Date(1990, 0, 1, 0, 0, 0, 0), new Date(2021, 0, 1, 0, 0, 0, 0)];
let kp_beginning = new Date(2008, 0, 1, 0, 0, 0, 0);
let kp_commitment_1 = new Date(2013, 0, 1, 0, 0, 0, 0);
let kp_commitment_2 = new Date(2020, 0, 1, 0, 0, 0, 0);
let yContentScale;
let xScale;
const brushContextHeight = 50;
const brushContextWidth = 600;
const areaChartMargin = { top: 50, right: 170, bottom: 100, left: 50 };


class AreaChart {
	constructor(svg, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country, x_value_range) {
		const height = 400;
		const width = 600;
		
		this.svg = svg;
		this.country = country;
		this.total_emissions = total_emissions;
		this.co2_emissions = co2_emissions;
		this.ch4_emissions = ch4_emissions;
		this.n2o_emissions = n2o_emissions;
		this.x_value_range = x_value_range;
		const y_value_range = [0, 1.2 * d3.max(total_emissions, d => parseInt(d.y))];

		// create a list of keys
		let keys = ["Total emissions", "CO2 emissions", "CH4 emissions", "N2O emissions"]
		let areaChartColors = d3.scaleOrdinal()
			.domain(keys)
			.range(["#13243c", "#122f57", "#2e516f", "#3b7681"])

		this.svg = this.svg.append('g');
		
		const xScale = d3.scaleTime()
			.domain(x_value_range)
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([height, 0]);

			
		
		///////////////////////////////////////////////////////////
		//////////				  		ADD CLIPPATH	  				 ////////// 	inspired by http://www.d3noob.org/2015/07/clipped-paths-in-d3js-aka-clippath.html 
		///////////////////////////////////////////////////////////    		 and https://www.d3-graph-gallery.com/graph/stackedarea_template.html)

		var clip = svg.append("defs").append("svg:clipPath")
		.attr("id", "clip-rect")
		.append("svg:rect")
		.attr("width", width )
		.attr("height", height )
		.attr("x", 0)
		.attr("y", 0);


		///////////////////////////////////////////////////////////
		//////////				  		AREA PLOTS		  				 //////////
		///////////////////////////////////////////////////////////
		
		this.svg_total_emissions = this.svg.append("path")
			.datum(this.total_emissions)
			.attr("fill", areaChartColors("Total emissions"))
			.attr("stroke", "#69b3a2")
			.attr("stroke-width", 1.5)
			.attr("class", "myArea total_emissions")
			.attr("clip-path", "url(#clip-rect")
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
			.attr("clip-path", "url(#clip-rect")
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
			.attr("clip-path", "url(#clip-rect")
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
			.attr("clip-path", "url(#clip-rect")
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date) })
				.y0(yScale(0))
				.y1(function(d) { return yScale(d.y) })
				)

		///////////////////////////////////////////////////////////
		//////////  PLOT LINES FOR THE KYOTO COMMITMENTS //////////
		///////////////////////////////////////////////////////////

		// Line for beginning of Kyoto protocol
		this.kp_0_line = this.svg.append("line")
			.attr("x1", xScale(kp_beginning))  
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_beginning))  
			.attr("y2", height)
			.attr("class", "kyoto-begining-lines")
			.attr("clip-path", "url(#clip-rect")

		this.kp_0_text = this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_beginning)})
			.attr("class", "kyoto-commitment-labels")
			.text("KP Beginning")
			.attr("clip-path", "url(#clip-rect")

		// Line for Kyoto 1st commitment
		this.kp_1_line = this.svg.append("line")
			.attr("x1", xScale(kp_commitment_1))  
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_commitment_1))  
			.attr("y2", height)
			.attr("class", "kyoto-commitment-lines")
			.attr("clip-path", "url(#clip-rect")

		this.kp_1_text = this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_commitment_1)})
			.attr("class", "kyoto-commitment-labels")
			.attr("clip-path", "url(#clip-rect")
			.text("KP 1st commitment ")
			.attr("clip-path", "url(#clip-rect")

		// Line for Kyoto 2nd commitment
		this.kp_2_line = this.svg.append("line")
			.attr("x1", xScale(kp_commitment_2))
			.attr("y1", 0 + 30)
			.attr("x2", xScale(kp_commitment_2))
			.attr("y2", height)
			.attr("class", "kyoto-commitment-lines")
			.attr("clip-path", "url(#clip-rect")

		this.kp_2_text = this.svg.append("text")
			.attr("y", 20)
			.attr("x", function(){ return xScale(kp_commitment_2) - 20})
			.attr("class", "kyoto-commitment-labels")
			.text("KP 2nd commitment")
			.attr("clip-path", "url(#clip-rect")
			
		
		///////////////////////////////////////////////////////////
		//////////		  			CREATE THE AXIS	  				 //////////
		///////////////////////////////////////////////////////////

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
        .attr("y", 0 - (areaChartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text(function() { 
					if (LULUCF == 1) {
						return selected_country + " GHG emissions (with LULUCF)";
					} else {
						return selected_country + " GHG emissions (without LULUCF)";
					}
				});


		///////////////////////////////////////////////////////////
		//////////		  		  HIGHLIGHT GROUP   				 ////////// inspired by https://www.d3-graph-gallery.com/graph/stackedarea_template.html
		///////////////////////////////////////////////////////////

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


		///////////////////////////////////////////////////////////
		//////////		  		    	LEGEND	      				 ////////// inspired by https://www.d3-graph-gallery.com/graph/stackedarea_template.html
		///////////////////////////////////////////////////////////

		// Add rect in the legend for each name.
		var size = 20
		this.svg.selectAll("mydots")
			.data(keys)
			.enter()
			.append("rect")
				.attr("x", width + 40)
				.attr("y", function(d,i){ return 140 + i*(size+15)}) 
				.attr("width", size)
				.attr("height", size)
				.style("fill", function(d){ return areaChartColors(d)})
				.attr("class", "area-chart-legend")
				.on("mouseover", highlight)
        .on("mouseleave", noHighlight)

		// Add legend text
		this.svg.selectAll("mylabels")
			.data(keys)
			.enter()
			.append("text")
				.attr("x", width + 40 + size*1.2)
				.attr("y", function(d,i){ return 140 + i*(size+15) + (size/2)}) 
				.style("fill", function(d){ return areaChartColors(d) })
				.text(function(d){ return d})
				.attr("text-anchor", "left")
				.attr("font-size", "0.8em")
				.style("alignment-baseline", "middle")
				.attr("class", "area-chart-legend")
				.on("mouseover", highlight)
        .on("mouseleave", noHighlight)
	}

	update(svg, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country, x_value_range) {
		this.svg = svg;
		const height = 400;
		const width = 600;

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


		///////////////////////////////////////////////////////////
		//////////			  	UPDATE AREA PLOTS	  				 //////////
		///////////////////////////////////////////////////////////

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


		/////////////////////////////////////////////////////////////////////////
		//////////   UPDATE LINES FOR KYOTO COMMITMENTS ON AREA CHART  //////////
		/////////////////////////////////////////////////////////////////////////

		// Beginning of Kyoto protocol phases
		this.kp_0_line
			.attr("x1", xScale(kp_beginning))  
			.attr("x2", xScale(kp_beginning))  
			.transition(t)

		this.kp_0_text
			.attr("x", function(){ return xScale(kp_beginning)})
			.transition(t)

		// Line for Kyoto 1st commitment
		this.kp_1_line
			.attr("x1", xScale(kp_commitment_1))  
			.attr("x2", xScale(kp_commitment_1))  
			.transition(t)

		this.kp_1_text
			.attr("x", function(){ return xScale(kp_commitment_1)})
			.transition(t)

		// Line for Kyoto 2nd commitment
		this.kp_2_line
			.transition(t)
			.attr("x1", xScale(kp_commitment_2))
			.attr("x2", xScale(kp_commitment_2))

		this.kp_2_text
			.transition(t)
			.attr("x", function(){ return xScale(kp_commitment_2) - 20})


		///////////////////////////////////////////////////////////
		//////////			  	   UPDATE AXIS    	  			 //////////
		///////////////////////////////////////////////////////////

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
			.attr("y", 0 - (areaChartMargin.top / 2))
			.text(function() { 
				if (LULUCF == 1) {
					return selected_country + " GHG emissions (with LULUCF)";
				} else {
					return selected_country + " GHG emissions (without LULUCF)";
				}
			});

	}
}


function loadAreaChart(country) {

	// check if country selected on map exist in database
	if (!(country in dataByGas)) {
		// $("#dyn-text").text("Sorry, emissions data for " + country + " is not available.");
		return;
	}

	// load data for different gases
	if (LULUCF == 1) {
		co2_emissions = loadGasDataByCountry(country, "CO2_LULU");
		ch4_emissions = loadGasDataByCountry(country, "CH4_LULU");
		n2o_emissions = loadGasDataByCountry(country, "N2O_LULU");
	} else {
		co2_emissions = loadGasDataByCountry(country, "CO2");
		ch4_emissions = loadGasDataByCountry(country, "CH4");
		n2o_emissions = loadGasDataByCountry(country, "N2O");
	}

	// calculate total emissions by summing all gases
	total_emissions = [];
	co2_emissions.forEach(function callback(element, index) {
		y_total = parseInt(co2_emissions[index].y) + parseInt(ch4_emissions[index].y) + parseInt(n2o_emissions[index].y);
		total_emissions.push({y: y_total, date: co2_emissions[index].date});
	})

	const svg_element_id = 'plot';
	let	svg = d3.select('#' + svg_element_id);

	if (!areaChart) {
		// creates a new Area Chart
		d3.selectAll("#plot > *").remove();

		console.log("width: ", width + areaChartMargin.left + areaChartMargin.right);

		svg = d3.select('#' + svg_element_id)
			.attr("width", width + areaChartMargin.left + areaChartMargin.right)
			.attr("height", height + areaChartMargin.top + areaChartMargin.bottom)
			.append("g")
			.attr('transform', `translate(${areaChartMargin.left}, ${areaChartMargin.top})`);


		areaChart = new AreaChart(svg, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country, x_value_range);

		/////////////// ///// //////////////////
		/////////////// BRUSH //////////////////
		/////////////// ///// //////////////////

		// Create a context for a brush
		var contextXScale = d3.scaleTime()
			.range([0, brushContextWidth])
			.domain(x_value_range);

		var contextAxis = d3.axisBottom(contextXScale)
			.tickSize(brushContextHeight)
			.tickPadding(-10);

		const y_value_range = [0, 1.2 * d3.max(total_emissions, d => parseInt(d.y))];

		xScale = d3.scaleTime()
			.domain(x_value_range)
			.range([0, 600]);

		yContentScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([brushContextHeight, 0]);


		var brush = d3.brushX()
		.extent([
			[contextXScale.range()[0], 0],
			[contextXScale.range()[1], brushContextHeight]
		])
		.on("brush", onBrush);

		let context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(0," + height + ")");

		this.contextArea = context.append("path")
			.datum(total_emissions)
			.attr("fill", "#E8E8E8")
			.attr("stroke", "#69b3a2")
			.attr("stroke-width", 1)
			.attr("class", "myArea total_emissions")
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date)	})
				.y0(yContentScale(0))
				.y1(function(d) { return yContentScale(d.y) })
				)

		/////////////////////////////////////////////////////////////////////////
		//////////  PLOT LINES FOR THE KYOTO COMMITMENTS ON BRUSH AREA //////////
		/////////////////////////////////////////////////////////////////////////

		// Beginning of Kyoto protocol phases
		context.append("line")
			.attr("x1", xScale(kp_beginning))  
			.attr("y1", 0)
			.attr("x2", xScale(kp_beginning))  
			.attr("y2", brushContextHeight + 10)
			.attr("class", "kyoto-begining-lines")
			.attr("clip-path", "url(#clip-rect")

		context.append("text")
			.attr("y", brushContextHeight + 20)
			.attr("x", function(){ return xScale(kp_beginning)})
			.attr("class", "kyoto-commitment-labels")
			.text("KP Beginning")
			.attr("clip-path", "url(#clip-rect")

		// Line for Kyoto 1st commitment
		context.append("line")
			.attr("x1", xScale(kp_commitment_1))  
			.attr("y1", 0)
			.attr("x2", xScale(kp_commitment_1))  
			.attr("y2", brushContextHeight + 10)
			.attr("class", "kyoto-commitment-lines")
			.attr("clip-path", "url(#clip-rect")

		context.append("text")
			.attr("y", brushContextHeight + 20)
			.attr("x", function(){ return xScale(kp_commitment_1)})
			.attr("class", "kyoto-commitment-labels")
			.attr("clip-path", "url(#clip-rect")
			.text("KP 1st commitment ")
			.attr("clip-path", "url(#clip-rect")

		// Line for Kyoto 2nd commitment
		context.append("line")
			.attr("x1", xScale(kp_commitment_2))
			.attr("y1", 0)
			.attr("x2", xScale(kp_commitment_2))
			.attr("y2", brushContextHeight + 10)
			.attr("class", "kyoto-commitment-lines")
			.attr("clip-path", "url(#clip-rect")

		context.append("text")
			.attr("y", brushContextHeight + 20)
			.attr("x", function(){ return xScale(kp_commitment_2) - 20})
			.attr("class", "kyoto-commitment-labels")
			.text("KP 2nd commitment")
			.attr("clip-path", "url(#clip-rect")

		context.append("g")
			.attr("class", "x axis top")
			.attr("transform", "translate(0,0)")
			.call(contextAxis)

		context.append("g")
			.attr("class", "x brush")
			.call(brush)
			.selectAll("rect")
			.attr("y", 0)
			.attr("height", brushContextHeight);

		context.append("text")
			.attr("class", "instructions")
			.attr("transform", "translate(0," + (brushContextHeight + 20) + ")")
			.text('Click and drag above to zoom or pan the data');

		// Brush handler. Get time-range from a brush and pass it to the charts. 
		function onBrush() {
			var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
			x_value_range = [b[0], b[1]];
			areaChart.update(svg, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country, x_value_range);
		}
	} else {
		// updates existing Area Chart with transitions
		areaChart.update(svg, total_emissions, co2_emissions, ch4_emissions, n2o_emissions, country, x_value_range);

		// update brush area content
		const y_value_range = [0, 1.2 * d3.max(total_emissions, d => parseInt(d.y))];

		yContentScale = d3.scaleLinear()
			.domain(y_value_range)
			.range([brushContextHeight, 0]);

		let t = d3.transition()
		.duration(750)
		.ease(d3.easeLinear);
				
		this.contextArea
			.datum(total_emissions)
			.transition(t)		
			.attr("d", d3.area()
				.x(function(d) { return xScale(d.date)	})
				.y0(yContentScale(0))
				.y1(function(d) { return yContentScale(d.y) })
				)
	}
}


function lodaDataAndDisplayAreaChart() {
	const PATH = "data/unfcc/time_series"

	///////////////////////////////////////////////////////////
	//////////	LOAD AND PREAPRE DATA FOR AREA CHART ////////// 
	///////////////////////////////////////////////////////////  

	// load and prepare the data here
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
			dataByGas[row.Party]["N2O_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["N2O_LULU"].push(row[key]);
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
		.defer(d3.csv, PATH + "/data_for_greenhouse_gas_total/Time Series - GHG total with LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["TOTAL_LULU"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["TOTAL_LULU"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, PATH + "/data_for_greenhouse_gas_total/Time Series - GHG total without LULUCF, in kt CO₂ equivalent.csv", function(row) {
			dataByGas[row.Party]["TOTAL"]= [];
			for (const key in row) {
				if(key != "Party") {
					dataByGas[row.Party]["TOTAL"].push(row[key]);
				}		
			}
		})
		.defer(d3.csv, "data/country_codes.csv", function(row) {
			// ISO 3166-1 alpha-3 codes data from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
			countryCodeName[row.Code] = row.Name;
		})
		.await(ready); // Once the loading is over, we enter the ready function that takes care of the plotting
	
	
		// Function executed after data has been loaded:
		function ready(error) {
			if (error) throw error;
			console.log("dataByGas: ", dataByGas);
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
		
			// load area chart based on selected country
			$('#countryDropdown li').on('click', function(){
				country = $(this).text();
				loadAreaChart(country);
				displayDynamicText(country);
			});
		}
}

function displayDynamicText(country) {
	let ghg_1990, ghg_2012, ghg_2018;

	if (!(country in dataByGas)) {
		$("#dyn-text").last().html("Sorry, emissions data for <b>" + country + "</b> is not available.");
	} else {
		$("#dyn-text").last().html(`
			According to the Kyoto protocol, 
			<span class="dynamic_text" id="s1">_____</span> 
			committed to 
			<span class="dynamic_text" id="s2">_____</span> 
			its GHG emissions by 
			<span class="dynamic_text" id="s3">_____</span> 
			by 2012, and to 
			<span class="dynamic_text" id="s4">_____</span> 
			its emissions by
			<span class="dynamic_text" id="s5">_____</span> 
			by 2018. 

			<br>It fact, has 
			<span class="dynamic_text" id="s6">_____</span> 
			its emissions by 
			<span class="dynamic_text" id="s7">___</span> 
			between 1990 and 2012, and 
			<span class="dynamic_text" id="s8">_____</span> 
			its emissions by 
			<span class="dynamic_text" id="s9">_____</span> 
			between 1990 and 2018. 
		`);
		$("#s1").text(country);

		if (kp_percentage[country]["kp1"] < 0) {
			$("#s2").text("decrease");	
		} else if (kp_percentage[country]["kp1"] == 0) {
			$("#s2").text("not change");	
		} else  {
			$("#s2").text("increase");	
		}

		$("#s3").text(kp_percentage[country]["kp1"] + "%");	

		if (kp_percentage[country]["kp2"] < 0) {
			$("#s4").text("decrease");	
		} else if (kp_percentage[country]["kp2"] == 0) {
			$("#s4").text("not change");	
		} else  {
			$("#s4").text("increase");	
		}

		$("#s5").text(kp_percentage[country]["kp2"] + "%");		

		if (LULUCF == 1) {
			ghg_1990 = dataByGas[country]["TOTAL_LULU"][0];
			ghg_2012 = dataByGas[country]["TOTAL_LULU"][2008 - 1990];
			ghg_2018 = dataByGas[country]["TOTAL_LULU"][2018 - 1990];
		} else {
			ghg_1990 = dataByGas[country]["TOTAL"][0];
			ghg_2012 = dataByGas[country]["TOTAL"][2008 - 1990];
			ghg_2018 = dataByGas[country]["TOTAL"][2018 - 1990];
		}
		
		// calculate actual percentage:
		rate_2012_1990 = (ghg_2012 - ghg_1990) / ghg_1990
		rate_2018_1990 = (ghg_2018 - ghg_1990) / ghg_2018

		if (rate_2012_1990 < 0) {
			$("#s6").text("decreased").addClass("success");	
			$("#s7").addClass("success");		
		} else if (rate_2012_1990 == 0) {
			$("#s6").text("not changed").addClass("mediocre");	
			$("#s7").addClass("mediocre");		
		} else  {
			$("#s6").text("increased").addClass("failure");	
			$("#s7").addClass("failure");		
		}

		$("#s7").text(Math.abs(Math.round(100 * rate_2012_1990)) + "%");		

		if (rate_2018_1990 < 0) {
			$("#s8").text("decreased").addClass("success");	
			$("#s9").addClass("success");		
		} else if (rate_2018_1990 == 0) {
			$("#s8").text("not changed").addClass("mediocre");	
			$("#s9").addClass("mediocre");		
		} else  {
			$("#s8").text("increased").addClass("failure");	
			$("#s9").addClass("failure");		
		}

		$("#s9").text(Math.abs(Math.round(100 * rate_2018_1990)) + "%");		
	}

}

function getAllCountries(dataByGas) {
	countries = [];
	for (const [key, value] of Object.entries(dataByGas)) {
		countries.push(key);
	}
	return countries;
}


function loadGasDataByCountry(country, gas) {
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


///////////////////////////////////////////////////////////
//////////				  		 MAP SECTION	  				 ////////// 
/////////////////////////////////////////////////////////// 

function displayMap() {

	width = 800;
	height = 450;

	function switchColors(year){
		let data = d3.map();
		d3.queue()
			.defer(d3.csv, "https://raw.githubusercontent.com/DAL12/Files/master/ghg" + year + ".csv", function(d) { data.set(d.code, +d.emission);})
			.await(ready);
		
		function ready(error, topo) {

		
			if (error) throw error;

			let svg = d3.select("#my_dataviz").select("g")

			svg
			.selectAll("path")
			.transition()
			.delay(2)
   			.duration(10)
			.attr("fill", function (d) {
				if (data.get(d.id)) {
					return color(data.get(d.id));
				}
				else {
					return d3.rgb(220,220,220);
				}
				}).style("stroke", "white")
			}
	}

	function createMapClick(year) {
		
		// The svg
		var svg = d3.select("#map-cont")
				.append("svg")
				.attr("id", "my_dataviz")
				.attr("width", width)
				.attr("height", height);
		
		let tooltip = d3.select("#map-cont")
						.append("div")
						.attr("class", "tooltip")
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
					selected_country = countryCodeName[d.id];
					loadAreaChart(selected_country);
					displayDynamicText(selected_country);
					updateBarChart();
				})		
				.on("mouseover",function(d,i){
					return tooltip.style("hidden", false).html(d.properties.name);
				})
				.on("mousemove",function(d){
					tooltip.classed("hidden", false)
						   .style("top", (d3.event.pageY) + "px")
						   .style("left", (d3.event.pageX + 10) + "px")
						   .html(d.properties.name);
				})
				.on("mouseout",function(d,i){
					tooltip.classed("hidden", true);
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
                    .width(1000)
                    .tickFormat(d3.timeFormat('%Y'))
                    .tickValues(dataTime)
                    .default(new Date(1990, 10, 3))
					.on('onchange', val => {switchPlots(d3.timeFormat('%Y')(val));});

	function switchPlots(time) {
		switchColors(time);
		removeEvenYears();
		year = time;
		updateBarChart();
	}
    
    var gTime = d3
                .select('div#slider-time')
                .append('svg')
                .attr('width', 1200)
                .attr('height', 80)
                .append('g')
                .attr('transform', 'translate(100,20)');
    
    gTime.call(sliderTime);

	function removeEvenYears() {

		let ticks_to_rm = d3.selectAll(".tick text");
	
		ticks_to_rm.each(function(_,i){
			if(i%2==0) {
				d3.select(this).attr("fill", "white");
			}
			else {
				d3.select(this).attr("fill", "grey");
			}
		});

	}

	removeEvenYears()
    
    
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


///////////////////////////////////////////////////////////
//////////				  	BAR CHART SECTION 				 ////////// 
/////////////////////////////////////////////////////////// 


///Variables///
//////////////////////////////////
////////LOADING THE DATA//////////
//////////////////////////////////

// Initializing objects to save csv content
let data_target = {}; // will store the reduction emission target of each country
let data_GHG_LULUCF = {}; //will store the reduction emission (compared to 1990) achieved for every year (and every country) with LULUCF
let data_GHG_no_LULUCF = {}; //will store the reduction emission (compared to 1990) achieved for every year (and every country) without LULUCF
let years = []

// Creating an object inside data_target for each type of target
data_target["target1"] = {};
data_target["target1noLULUCF"] = {};
data_target["target2"] = {};
data_target["target2noLULUCF"] = {};

// Creating an object inside data_GHG_LULUCF and data_GHG_no_LULUCF for each year
for (i = 1990; i <= 2018; i++) {
	data_GHG_LULUCF[String(i)] = {};
	data_GHG_no_LULUCF[String(i)] = {};
	years.push(i);
} 


let svg_chart;
let node_g_target;
let node_g_em;
let node_g_flags;
let node_g_mark;
let xAxis;
let selected_country = "United States of America";
let k_new;
let k;
let LULUCF = 0;
let target = "target1noLULUCF"; //default of the dropdown menu
let year = 1990; //default of the dropdown menu
let selected_data = data_GHG_no_LULUCF; //default of the dropdown menu
let kp_percentage = {};

// Definition SVG parameters
let w_chart = document.getElementById('chart').clientWidth - 2 * 16 ;//take into account the 1rem padding of svg
let h_chart = 800;
let xaxis_height_padding = h_chart/15;
let padding_chart = h_chart/10;
let paddingx_label = 5;
let origin = w_chart / 2;
let width_mark = 2;
let x_Scale = d3.scaleLinear().range([- (w_chart/2 - padding_chart), w_chart/2 - padding_chart]);
let y_Scale = d3.scaleBand().rangeRound([0, h_chart - xaxis_height_padding - 3]).paddingInner(0.35);


function displayBarChart() {

    // Reading csv and pouring their content in their respect data object
    d3.queue()
            .defer(d3.csv, "data/Kyoto_targets.csv", function(d) {
								// console.log("d: ", d);
                data_target["target1"][d.Party] = -parseFloat(d.target1); // minus to convert it to a "reduction" in emission
                data_target["target1noLULUCF"][d.Party] = -parseFloat(d.target1no);
                data_target["target2"][d.Party] = -parseFloat(d.target2);
                data_target["target2noLULUCF"][d.Party] = -parseFloat(d.target2no);
								kp_percentage[d.Party] = {"kp1": -parseFloat(d["Kyoto target 2008-2012"]), "kp2": -parseFloat(d["Kyoto target 2013-2020"])};
							})
            .defer(d3.csv, "data/GHG_LULUCF.csv", function(d) {
                for (i = 1990; i <= 2018; i++) {
                data_GHG_LULUCF[String(i)][d.Party] = parseFloat(d[1990]) - parseFloat(d[String(i)]); // storing the reduction compared to the year 1990
                }

        })
            .defer(d3.csv, "data/GHG_no_LULUCF.csv", function(d) {
                for (i = 1990; i <= 2018; i++) {
                data_GHG_no_LULUCF[String(i)][d.Party] = parseFloat(d[1990]) - parseFloat(d[String(i)]);
                }

        })
            .await(ready); // Once the loading is over, we enter the ready function that takes care of the plotting
    //////////////////////////////////
    ////////PLOTTING FUNCTION/////////
    //////////////////////////////////

    // Function executed after data has been loaded:
    function ready(error) {

        //if error during the logging:
        if (error) throw error;

				// console.log("kp_percentage", kp_percentage);

		k = Object.keys(data_target[target]).length/2;
		k_new = k;
        createBarChart();

		//////////////////////////////////
		//////////ADDING BUTTONS//////////
		//////////////////////////////////

		// Creating a Dropdown Menu for choosing the number of countries to display
		d3.select("#select_k_Button")
		.selectAll('myOptions')
		.data(d3.range(Object.keys(data_target[target]).length / 2, 9, -1))
		.enter()
		.append('option')
		.text(function (d) { return d; })
		.attr("value", function (d) { return d; })

		// Creating a Dropdown Menu for choosing the dataset (LULUCF or no LULUCF)
		d3.select("#select_LULUCF_Button")
		.selectAll('myOptions')
		.data(["No Land Use, Land-Use Change and Forestry (No LULUCF)", "Land Use, Land-Use Change and Forestry (LULUCF)"])
		.enter()
		.append('option')
		.text(function (d) { return d; })
		.attr("value", function (d, i) { return i; })

		// Event listener to update the chart when the user changes some parameters
		d3.selectAll(".button").on("change", function() {

			LULUCF = d3.select("#select_LULUCF_Button").property("value");
			k_new = d3.select("#select_k_Button").property("value");
			updateBarChart();
			loadAreaChart(selected_country);
			displayDynamicText(selected_country);
		})

		// Event listener to update the chart when the user selects a country on the plot above
		$('#countryDropdown li').on('click', function(){
			selected_country = $(this).text();;
			// console.log(selected_country)
			updateBarChart();
		});
    }
}

function createBarChart () {
	// Creating SVG for the ranking plot:
	svg_chart = d3
	.select("#chart")
	.append("svg")
	.attr("width", w_chart)
	.attr("height", h_chart);

	// Filtering the data loaded to keep only the k best (and k worst) country in 1990 and target type.
	// Note that the "best" ones in 1990 are the ones with the k highest goals.
	// console.log(data_target);
	// console.log(year);
	let data = ranking_reduction();
	// console.log(data);
	let topk_countries = data[0];
	let topk_reduction = data[1];
	let topk_kyoto_goal = data[2];


	// Console log for codding purposes (TODO: Delete them at the end)
	// console.log(topk_countries)
	// console.log(topk_kyoto_goal)
	// console.log(topk_reduction)

	// Changing domain
	x_Scale.domain([-d3.max([d3.max(topk_kyoto_goal), d3.max(topk_reduction)]),d3.max([d3.max(topk_kyoto_goal), d3.max(topk_reduction)])])
	y_Scale.domain(d3.range(topk_kyoto_goal.length))

	// Defining Axis
	xAxis = d3.axisBottom().scale(x_Scale).tickFormat(d3.format(".2s"));

	// Adding vertical separator
	svg_chart.append("line")
	.style("stroke", "black")
	.style("stroke-width", 2)
	.attr("class", "sep")
	.attr("x1", origin)
	.attr("y1", 0)
	.attr("x2", origin)
	.attr("y2", h_chart - xaxis_height_padding);

	// Creating three new groups inside the svg
	node_g_target = svg_chart.append("g").classed("target", true);
	node_g_em = svg_chart.append("g").classed("em", true);
	node_g_flags = svg_chart.append("g").classed("img", true);
	node_g_mark = svg_chart.append("g").classed("goal", true);

	node_g_legend = svg_chart.append("g").classed("legend", true)
	// .attr("width", 3.5 * y_Scale.bandwidth())
	// .attr("height", 5 * y_Scale.bandwidth())


	//at this stage, we have <svg>
	//                             <g class="target" .... </g>
	//                             <g class="em" .... </g>
	//                             <g class="img" ....</g>
	//                             <g class="legend" .... </g>
	//                       </svg>

	//Adding rectangles inside the corresponding group (here: target)
	node_g_target
	.selectAll(".target")
	.data(topk_kyoto_goal)
	.enter()
	.append("rect")
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d) {
		if (d >= 0) {
			return origin
		}
		else {
			return origin - x_Scale(Math.abs(d))
		}
	}
	)
	.attr("height", y_Scale.bandwidth())
	.attr("width", function (d) {
		return x_Scale(Math.abs(d));
	})
	.attr("fill", "gray");

	//Adding rectangles inside the corresponding group (here: em)
	node_g_em
	.selectAll(".em")
	.data(topk_reduction)
	.enter()
	.append("rect")
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d) {
		if (d >= 0) {
			return origin
		}
		else {
			return origin - x_Scale(Math.abs(d));
		}
	}
	)
	.attr("height", y_Scale.bandwidth())
	.attr("width", function (d, i) {
		return x_Scale(Math.abs(d));
	})
	.attr("fill", function(d,i) {
		if (topk_countries[i] == selected_country) {
			return "darkblue"
		}
		if (d >= 0) {
			return "green"
		}
		else {
			return "black"
		}
	});

	//Adding flags inside the corresponding group (here: img)
	node_g_flags
	.selectAll(".img")
	.data(topk_countries)
	.enter()
	.append("svg:image")
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d,i) {
		return origin + Math.max(x_Scale(topk_reduction[i]), x_Scale(topk_kyoto_goal[i]), 0) + y_Scale.bandwidth()/5
	})
	.attr("height", y_Scale.bandwidth())
	.attr("xlink:href", function (d) {
		return "Images/" + d + ".png";
	});

	// Drawing the axis
	svg_chart.append("g").attr("class", "axis_chart").attr("transform", "translate(" + origin + "," + (h_chart - xaxis_height_padding) + ")").call(xAxis);

	//Adding a red mark at the kyoto reduction emission goal of country
	node_g_mark
	.selectAll(".goal")
	.data(topk_kyoto_goal)
	.enter()
	.append("rect")
	.attr("y", function (d, i) {
		return y_Scale(i) - 1;
	})
	.attr("x", function (d) { return origin + x_Scale(d) - width_mark})
	.attr("height", y_Scale.bandwidth() + 2)
	.attr("width", function (d) {
		return width_mark;
	})
	.attr("fill", "red");

	// Adding x label
	svg_chart.append("text")
	.attr("text-anchor", "end")
	.attr("x", w_chart - padding_chart)
	.attr("y", h_chart - paddingx_label)
	.attr("font-size", '20px')
	.text("Reduction in GHG emission (in kt CO2 equivalent)");

	// Adding the legend
	node_g_legend.append("rect")
	.attr("y", 45)
	.attr("x", 24)
	.attr("height", 24)
	.attr("width", 72)
	.attr("fill", "gray");

	node_g_legend.append("rect")
	.attr("y", 44)
	.attr("x", 95)
	.attr("height", 26)
	.attr("width", 2)
	.attr("fill", "red");

	node_g_legend.append("rect")
	.attr("y", 82)
	.attr("x", 24)
	.attr("height", 24)
	.attr("width", 72)
	.attr("fill", "black");

	node_g_legend.append("rect")
	.attr("y", 119)
	.attr("x", 24)
	.attr("height", 24)
	.attr("width", 72)
	.attr("fill", "green");

	node_g_legend.append("text")
	.attr("x", 120)
	.attr("y", 63)
	.attr("font-size", '20px')
	.text("Kyoto GHG Emission Reduction Target");

	node_g_legend.append("text")
	.attr("x", 120)
	.attr("y", 100)
	.attr("font-size", '20px')
	.text("Increase in GHG emission since 1990");

	node_g_legend.append("text")
	.attr("x", 120)
	.attr("y", 137)
	.attr("font-size", '20px')
	.text("Decrease in GHG emission since 1990");

	node_g_legend.append("rect")
	.attr("y", 8)
	.attr("x", 0)
	.attr("height", 185)
	.attr("width", 530)
	.attr("fill", "none")
	.attr("stroke", "black");
}

function ranking_reduction() {
	/* 
	Function reducing the csv loaded before to focus on the year, the type of emission,
	the kyoto data target type, and the number k of best country (and worst country) that the user selected.

	It returns the top k countries and worst k countries, alongside with their respective emission reduction 
	as well as their goal.
	*/

	const topk_countries = [];
	const topk_reduction = [];
	const topk_kyoto_goal = [];

	if (year > 1990) {
		let data = selected_data[year];
		Object.keys(data).sort((a,b) => data[b] - data[a]).forEach((key, ind) =>
		{
			if(ind < k | ind >= Object.keys(data).length - k){
				topk_countries.push(key);
				topk_reduction.push(data[key]);
				topk_kyoto_goal.push(data_target[target][key]);

			}
		});
	}

	else {
		let data = data_target[target];
		// console.log(data)
		// console.log(k)
		Object.keys(data).sort((a,b) => data[b] - data[a]).forEach((key, ind) =>
		{
			if(ind < k | ind >= Object.keys(data).length - k){
				topk_countries.push(key);
				topk_reduction.push(0);
				topk_kyoto_goal.push(data_target[target][key]);

			}
		});
	}

	return [topk_countries, topk_reduction, topk_kyoto_goal];
}

// Function to update the plot when the user changes the parameters thanks to the dropdown button
function updateBarChart() {
            
	// Update the target depending on the year:
	if (year > 2012) {
		target = "target2";
	}

	else {
		target = "target1";
	}

	// Update the selected dataset:
	if (LULUCF == 1) {
		selected_data = data_GHG_LULUCF;
	}
	
	else {
		selected_data = data_GHG_no_LULUCF;
		target = target + "noLULUCF"
	}

	// In case of a change of k: replot the chart
	if (k_new != k) {
		d3.selectAll("#chart > *").remove();
		k = k_new;
		createBarChart();
	}

	//console.log(target)
	// with the new variables target, selected_data and k: find the new ranking
	let data = ranking_reduction();
	let topk_countries = data[0];
	let topk_reduction = data[1];
	let topk_kyoto_goal = data[2];


	// Console log for codding purposes (TODO: Delete them at the end)
	// console.log(topk_countries)
	// console.log(topk_kyoto_goal)
	// console.log(topk_reduction)
	
	// Redefining Scales
	x_Scale.domain([-d3.max([d3.max(topk_kyoto_goal), d3.max(topk_reduction)]),d3.max([d3.max(topk_kyoto_goal), d3.max(topk_reduction)])])
	y_Scale.domain(d3.range(topk_kyoto_goal.length));

	// Redefining range of x so that flags fit
	x_Scale.range([- (w_chart/2 - padding_chart - 2 * y_Scale.bandwidth()), w_chart/2 - padding_chart - 2 * y_Scale.bandwidth()]);

	//Update the rectangles inside the corresponding group (here: target)
	node_g_target
	.selectAll("rect")
	.data(topk_kyoto_goal)
	.transition()
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d) {
		if (d >= 0) {
			return origin
		}
		else {
			return origin - x_Scale(Math.abs(d))
		}
	}
	)
	.attr("height", y_Scale.bandwidth())
	.attr("width", function (d) {
		return x_Scale(Math.abs(d));
	})
	.attr("fill", "gray");

	//Update the rectangles inside the corresponding group (here: em)
	node_g_em
	.selectAll("rect")
	.data(topk_reduction)
	.transition()
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d) {
		if (d >= 0) {
			return origin
		}
		else {
			return origin - x_Scale(Math.abs(d));
		}
	}
	)
	.attr("height", y_Scale.bandwidth())
	.attr("width", function (d, i) {
		return x_Scale(Math.abs(d));
	})
	.attr("fill", function(d,i) {
		if (topk_countries[i] == selected_country) {
			return "darkblue"
		}
		if (d >= 0) {
			return "green"
		}
		else {
			return "black"
		}
	});

	//Update the flags inside the corresponding group (here: img)
	node_g_flags
	.selectAll("image")
	.data(topk_countries)
	.transition()
	.attr("y", function (d, i) {
		return y_Scale(i);
	})
	.attr("x", function (d,i) {
		return origin + Math.max(x_Scale(topk_reduction[i]), x_Scale(topk_kyoto_goal[i]), 0) + y_Scale.bandwidth()/5
	})
	.attr("height", y_Scale.bandwidth())
	.attr("xlink:href", function (d) {
		return "Images/" + d + ".png";
	});

	//Repositionning the red mark at the kyoto reduction emission goal of countries
	node_g_mark
	.selectAll("rect")
	.data(topk_kyoto_goal)
	.transition()
	.attr("y", function (d, i) {
		return y_Scale(i) - 1;
	})
	.attr("x", function (d) { return origin + x_Scale(d) - width_mark})
	.attr("height", y_Scale.bandwidth() + 2)
	.attr("width", function (d) {
		return width_mark;
	})
	.attr("fill", "red");

	// Update the axis
	svg_chart.select(".axis_chart").transition().call(xAxis);

}



/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	displayMap();
	mapProgressBar();
	lodaDataAndDisplayAreaChart();
	displayBarChart();
});




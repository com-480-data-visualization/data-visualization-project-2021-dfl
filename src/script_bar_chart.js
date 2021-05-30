/* 
Author: Loïc Busson
Goal: Bar Chart Ranking for Data Visualization Project
Last Modified: 30/05/2021

Inspired by 2021 EPFL Data Visualization lectures 
and Scott Murray's book: Interactive Data Visualization for the Web
*/ 

// Initializing objects to save csv content
let data_target = {};
let data_GHG_LULUCF = {};
let data_GHG_no_LULUCF = {};
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

// Reading csv and pouring their content in their respect data object
d3.queue()
        .defer(d3.csv, "data/Kyoto_targets_copy.csv", function(d) {
            data_target["target1"][d.Party] = -parseFloat(d.target1); // minus to convert it to a "reduction"
            data_target["target1noLULUCF"][d.Party] = -parseFloat(d.target1);
            data_target["target2"][d.Party] = -parseFloat(d.target1);
            data_target["target2noLULUCF"][d.Party] = -parseFloat(d.target1);})
        .defer(d3.csv, "data/GHG_LULUCF_copy.csv", function(d) {
            for (i = 1990; i <= 2018; i++) {
            data_GHG_LULUCF[String(i)][d.Party] = parseFloat(d[1990]) - parseFloat(d[String(i)]); // storing the reduction compared to the year 1990
            }

    })
        .defer(d3.csv, "data/GHG_no_LULUCF_copy.csv", function(d) {
            for (i = 1990; i <= 2018; i++) {
            data_GHG_no_LULUCF[String(i)][d.Party] = parseFloat(d[1990]) - parseFloat(d[String(i)]);
            }

    })
        .await(ready); // Once the loading is over, we enter the ready function that takes care of the plotting

function ranking_reduction(year, reduction_emission_dataset, kyoto_data, target, k) {
    /* 
    Function reducing the csv loaded before to focus on the year, the type of emission,
    the kyoto data target type, and the number k of best country that the user selected.

    It returns the ten k top countries, alongside with their respective emission reduction 
    as well as their goal.
    */
    let data = reduction_emission_dataset[year];

    const topk_countries = [];
    const topk_reduction = [];
    const topk_kyoto_goal = [];

    Object.keys(data).sort((a,b) => data[b] - data[a]).forEach((key, ind) =>
   {
      if(ind < k){
         topk_countries.push(key);
         topk_reduction.push(data[key]);
         topk_kyoto_goal.push(kyoto_data[target][key]);

      }
   });

   return [topk_countries, topk_reduction, topk_kyoto_goal];

}

// Function executed after data has been loaded:
function ready(error, topo) {

    //if error during the logging:
    if (error) throw error;


    // Console log for codding purposes (TODO: Delete them at the end)
    console.log("target", data_target)
    console.log("LULUCF", data_GHG_LULUCF)
    console.log("noLULUCF", data_GHG_no_LULUCF)


    // SVG parameters
    let w_chart = 1600;
    let h_chart = 700;
    let xaxis_height_padding = h_chart/15;
    let padding_chart = h_chart/10;
    let paddingx_label = 2;
    let flag_width = w_chart / 25;
    let origin = w_chart / 2;
    let img_origin = 0;
    let width_mark = 1;
    let target = "target1";
    let year = 1990;
    let k = 38;

    // Creating SVG for the ranking plot:The .dropdown-content class holds the actual dropdown menu. It is hidden by default, and will be displayed on hover (see below). Note the min-width is set to 160px. Feel free to change this. Tip: If you want the width of the dropdown content to be as wide as the dropdown button, set the width to 100% (and overflow:auto to enable scroll on small screens). <svg>
    let svg_chart = d3
    .select("#chart")
    .append("svg")
    .attr("width", w_chart)
    .attr("height", h_chart);

    // Creating a Dropdown Menu for choosing the year
    //svg_chart.append("button").classed("dropbtn", true).attr("onclick", "toggle()")
    d3.select("#select_year_Button")
      .selectAll('myOptions')
      .data(years)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })


    // Filtering the data loaded to keep only the k best country in year and target type
    let data = ranking_reduction(year, data_GHG_LULUCF, data_target, target, k);
    let top10_countries = data[0];
    let top10_reduction = data[1];
    let top10_kyoto_goal = data[2];


    // Console log for codding purposes (TODO: Delete them at the end)
    console.log(top10_countries)
    console.log(top10_kyoto_goal)
    console.log(top10_reduction)

    
    // Defining Scales
    let x_Scale = d3.scaleLinear()
    .domain([-d3.max([d3.max(top10_kyoto_goal), d3.max(top10_reduction)]),d3.max([d3.max(top10_kyoto_goal), d3.max(top10_reduction)])])
    .range([- (w_chart/2 - padding_chart), w_chart/2 - padding_chart]);
    let y_Scale = d3.scaleBand().domain(d3.range(top10_kyoto_goal.length)).rangeRound([0, h_chart - xaxis_height_padding - 3]).paddingInner(0.35);

    // Defining Axis
    let xAxis = d3.axisBottom().scale(x_Scale).tickFormat(d3.format(".2s"));

    // Creating three new groups inside the svg
    let node_g_target = svg_chart.append("g").classed("target", true);
    let node_g_em = svg_chart.append("g").classed("em", true);
    let node_g_flags = svg_chart.append("g").classed("img", true);
    let node_g_mark = svg_chart.append("g").classed("goal", true);

    //at this stage, we have <svg>
    //                             <g class="target" .... </g>
    //                             <g class="em" .... </g>
    //                             <g class="img" ....</g>
    //                       </svg>

    //Adding rectangles inside the corresponding group (here: target)
    node_g_target
    .selectAll(".target")
    .data(top10_kyoto_goal)
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
    .data(top10_reduction)
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
    .attr("fill", function(d) {
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
    .data(top10_countries)
    .enter()
    .append("svg:image")
    .attr("y", function (d, i) {
        return y_Scale(i);
    })
    .attr("x", img_origin)
    .attr("height", y_Scale.bandwidth())
    .attr("width", flag_width)
    .attr("xlink:href", function (d) {
        return "Images/" + d + ".png";
    });

    //Adding a red mark at the kyoto reduction emission goal of country
    node_g_mark
    .selectAll(".goal")
    .data(top10_kyoto_goal)
    .enter()
    .append("rect")
    .attr("y", function (d, i) {
        return y_Scale(i);
    })
    .attr("x", function (d) { return origin + x_Scale(d) - width_mark})
    .attr("height", y_Scale.bandwidth())
    .attr("width", function (d) {
        return width_mark;
    })
    .attr("fill", "red");

    // Drawing the axis
    svg_chart.append("g").attr("class", "axis").attr("transform", "translate(" + origin + "," + (h_chart - xaxis_height_padding) + ")").call(xAxis);

    // Adding vertical separator
    svg_chart.append("line")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("class", "sep")
    .attr("x1", origin)
    .attr("y1", 0)
    .attr("x2", origin)
    .attr("y2", h_chart - xaxis_height_padding);

    // Adding x label
    svg_chart.append("text")
    .attr("text-anchor", "end")
    .attr("x", w_chart - padding_chart)
    .attr("y", h_chart - paddingx_label)
    .attr("font-size", '10px')
    .text("Reduction in GHG emission (in kt CO2 equivalent)");

    // Function to update the plot when the user changes the year thanks to the dropdown button
    function update(year) {
        
    // Filtering the data loaded to keep only the k best country in year and target type
    let data = ranking_reduction(year, data_GHG_LULUCF, data_target, target, k);
    let top10_countries = data[0];
    let top10_reduction = data[1];
    let top10_kyoto_goal = data[2];


    // Console log for codding purposes (TODO: Delete them at the end)
    console.log(top10_countries)
    console.log(top10_kyoto_goal)
    console.log(top10_reduction)

    
    // Redefining Scales
    x_Scale.domain([-d3.max([d3.max(top10_kyoto_goal), d3.max(top10_reduction)]),d3.max([d3.max(top10_kyoto_goal), d3.max(top10_reduction)])])
    y_Scale.domain(d3.range(top10_kyoto_goal.length));

    //Adding rectangles inside the corresponding group (here: target)
    node_g_target
    .selectAll("rect")
    .data(top10_kyoto_goal)
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

    //Adding rectangles inside the corresponding group (here: em)
    node_g_em
    .selectAll("rect")
    .data(top10_reduction)
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
    .attr("fill", function(d) {
        if (d >= 0) {
            return "green"
        }
        else {
            return "black"
        }
    });

    //Adding flags inside the corresponding group (here: img)
    node_g_flags
    .selectAll("image")
    .data(top10_countries)
    .transition()
    .attr("y", function (d, i) {
        return y_Scale(i);
    })
    .attr("x", img_origin)
    .attr("height", y_Scale.bandwidth())
    .attr("width", flag_width)
    .attr("xlink:href", function (d) {
        return "Images/" + d + ".png";
    });

    //Adding a red mark at the kyoto reduction emission goal of country
    node_g_mark
    .selectAll("rect")
    .data(top10_kyoto_goal)
    .transition()
    .attr("y", function (d, i) {
        return y_Scale(i);
    })
    .attr("x", function (d) { return origin + x_Scale(d) - width_mark})
    .attr("height", y_Scale.bandwidth())
    .attr("width", function (d) {
        return width_mark;
    })
    .attr("fill", "red");

    // Drawing the axis
    svg_chart.select(".axis").transition().call(xAxis);

    }

    d3.select("#select_year_Button").on("change", function(d) {
        let year = d3.select(this).property("value")
        update(year)
    })
}

//TODO: weekend: read and apply the chapter on Updates, transitions and motion ==> get the automatic ranking
//TODO: don't fortget to update the Scales and the Axis (170)
//TODO: Add flag with values after the rectangles

//TODO: have an origin that is not fixed. fix the variable origin to min of all rectangles

//TODO: early next week: read and apply chapter on interactivity + brushing to get the ranking on many whatever year

//TODO: middle of the week: merge with the others

//TODO: Report + movie

/* 
Author: Loïc Busson
Goal: Bar Chart Ranking for Data Visualization Project
Last Modified: 01/06/2021

Inspired by 2021 EPFL Data Visualization lectures 
and Scott Murray's book: Interactive Data Visualization for the Web.
*/ 

/*
The goal of this .js file is to build and update the ranking bar chart of the website.
*/


function main() {

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

    // Reading csv and pouring their content in their respect data object
    d3.queue()
            .defer(d3.csv, "data/Kyoto_targets.csv", function(d) {
                data_target["target1"][d.Party] = -parseFloat(d.target1); // minus to convert it to a "reduction" in emission
                data_target["target1noLULUCF"][d.Party] = -parseFloat(d.target1no);
                data_target["target2"][d.Party] = -parseFloat(d.target2);
                data_target["target2noLULUCF"][d.Party] = -parseFloat(d.target2no);})
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


        // Console log for codding purposes (TODO: Delete them at the end)
        // console.log("target", data_target)
        // console.log("LULUCF", data_GHG_LULUCF)
        // console.log("noLULUCF", data_GHG_no_LULUCF)

        //////////////////////////////////
        ////////DEFINING VARIABLES////////
        //////////////////////////////////

        // Definition of global variables
        let svg_chart;
        let node_g_target;
        let node_g_em;
        let node_g_flags;
        let node_g_mark;
        let xAxis;
        let selected_country;
        let k_new;
        let LULUCF;
        let target = "target1noLULUCF"; //default of the dropdown menu
        let year = 1990; //default of the dropdown menu
        let selected_data = data_GHG_no_LULUCF //default of the dropdown menu
        let k = Object.keys(data_target[target]).length/2; //default of the dropdown menu

        // Definition SVG parameters
        let w_chart = document.getElementById('chart').clientWidth - 2 * 16 //take into account the 1rem padding of svg
        let h_chart = 1000
        let xaxis_height_padding = h_chart/15;
        let padding_chart = h_chart/10;
        let paddingx_label = 10;
        let origin = w_chart / 2;
        let width_mark = 1;
        let x_Scale = d3.scaleLinear().range([- (w_chart/2 - padding_chart), w_chart/2 - padding_chart]);
        let y_Scale = d3.scaleBand().rangeRound([0, h_chart - xaxis_height_padding - 3]).paddingInner(0.35);

        //////////////////////////////////
        //////////ADDING BUTTONS//////////
        //////////////////////////////////

        // Creating a Dropdown Menu for choosing the year
        d3.select("#select_year_Button")
        .selectAll('myOptions')
        .data(years)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

        // Creating a Dropdown Menu for choosing the number of countries to display
        d3.select("#select_k_Button")
        .selectAll('myOptions')
        .data(d3.range(Object.keys(data_target[target]).length / 2, 2, -1))
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

        // Creating a Dropdown Menu for choosing the dataset (LULUCF or no LULUCF)
        d3.select("#select_LULUCF_Button")
        .selectAll('myOptions')
        .data(["No LULUCF", "LULUCF"])
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d, i) { return i; })

        //////////////////////////////////
        ////////RANKING FUNCTION//////////
        //////////////////////////////////
        
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


        ///////////////////////////////////
        ////INITIALIZATION OF THE CHART////
        ///////////////////////////////////

        function creation () {

            // Creating SVG for the ranking plot:
            svg_chart = d3
            .select("#chart")
            .append("svg")
            .attr("width", w_chart)
            .attr("height", h_chart);

            // Filtering the data loaded to keep only the k best (and k worst) country in 1990 and target type.
            // Note that the "best" ones in 1990 are the ones with the k highest goals.
            let data = ranking_reduction();
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

            //at this stage, we have <svg>
            //                             <g class="target" .... </g>
            //                             <g class="em" .... </g>
            //                             <g class="img" ....</g>
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

        }
        
        //////////////////////////////////
        ////////UPDATING THE GRAPH////////
        //////////////////////////////////

        // Function to update the plot when the user changes the parameters thanks to the dropdown button
        function update() {
            
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
                creation();
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

        //////////////////////////////////
        //////////EVENT LISTENERS/////////
        //////////////////////////////////

        // Event listener to update the chart when the user changes some parameters
        d3.selectAll(".button").on("change", function() {

            year = d3.select("#select_year_Button").property("value");
            LULUCF = d3.select("#select_LULUCF_Button").property("value");
            k_new = d3.select("#select_k_Button").property("value");
            update()
        })

        let select = document.getElementById("countryDropdown"); 
        console.log(select);

        // Event listener to update the chart when the user selects a country on the plot above
        $('#countryDropdown li').on('click', function(){
            selected_country = $("#countryDropdown li").text();
            // console.log(selected_country)
            update();
        });

        // d3.select("#handle").on("change", function() {

        //     year = d3.timeFormat('%Y')(d3.select(this).property("aria-valuenow"));
        //     console.log(year);
        //     // console.log(typeof year);
        // })
        // Calling the creation function to initialize the chart:
        creation();
    }
}

main();


//TODO: have an origin that is not fixed. fix the variable origin to min of all rectangles (à voir)

// Tuesday:
//TODO: link with Dora's slider

// Wednesday:
//TODO: End story telling and CSS nice
//TODO: See if I can include NaNs
//TODO: Pimp the chart (space between flags, axis, colors,... )
//TODO: Start writting report

//Thursday:
//TODO: Finish writing report
//TODO: Shoot movie

//Friday:
//TODO: report end


//TODO: if black bar -> put the flag on the left?



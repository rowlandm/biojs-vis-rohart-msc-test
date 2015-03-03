/*
 * biojs-vis-rohart-msc-test
 * https://github.com/rowlandm/biojs-vis-rohart-msc-test
 *
 * Copyright (c) 2014 rowlandm
 * Licensed under the Apache 2 license.
 */

/**
@class biojsvisrohartmsctest
 */
/*
    Copyright 2015 Rowland Mosbergen

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.




    This is a standalone unit to call when you want to create a graph
    similar to the msc signature graphs that Florian developed.

    Basic usage is like this:
    ================================================================================
    //data columns are Replicate_Group_ID,Sample_Type,chip_id,prediction,lwr,upr

    // needs the following:
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.6.3/d3-tip.min.js"></script>

    // have to set this up here so that the tooltip can use these values
    var horizontal_lines = {'lwr':0.4337,'upr':0.5169};

    // this tooltip function is passed into the graph via the tooltip
    var tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, +110])
      .html(function(d) {
        msc_type = d.MSC_Type;
        // 2 decimal places on the display only
        // 95% CI [0.66,0.71] 
        // MSC 100/100
        temp = "Sample: " + d.Replicate_Group_ID +"("+d.chip_id+")<br/>MSC x/100<br/>Prediction value: " + d[y_column] + "<br/>lwr: " + d.lwr + "<br/>upr: " + d.upr;
        return temp; 
      });

    //data columns are state,type,component1,component2 tab separated
    data_url= 'http://www.stemformatics.org/msc_signature/get_msc_signature_values?ds_id=6037'
    d3.tsv(,function (error,data){
        
        count = 0; 
        data.forEach(function(d){
            // ths + on the front converts it into a number just in case
            d.lwr = +d.lwr;
            d.prediction = +d.prediction;
            d.upr = +d.upr;
            count++;

        });

        title = "Rohart MSC Score for Dataset XYZ";
        subtitle = "Subtitle"
        target = "#graph";

        // can always use just a straight value, but it's nicer when you calculate
        // based off the number of samples that you have
        width = data.length*30 + 200;
        if (width < 1000){
            width = 1000;
        }

        var options = {
            target: target,
            title: title,
            subtitle: subtitle,
            unique_id: "chip_id",
            domain_colors : {'MSC':'grey','Non-MSC':'grey','Unsure':'grey'},
            margin:{top: 180, right: 120, bottom: 530, left: 200},
            horizontal_lines: horizontal_lines,  // this gets turned into an array of objects
            horizontal_line_value_column: 'value',
            show_horizontal_line_labels: true,
            legend_class: "legend",
            height: 1020,
            error_bar_width:10, 
            x_axis_text_angle:-45, 
            width:width, // suggest 50 per sample
            x_column:'Replicate_Group_ID',
            y_column:'prediction',
            title_class: "title",
            x_axis_title: "Samples",
            y_axis_title: "Rohart Score",
            tooltip: tooltip, // using d3-tips
            data: data
          }

          var new_instance = Rohart_MSC_Graph(options);
     

    }); 
    
*/




/**
 * Private Methods
 */

/*
 * Public Methods
 */

/**
 * Method responsible to say Hello
 *
 * @example
 *
 *     biojsvisrohartmsctest.hello('biojs');
 *
 * @method hello
 * @param {String} name Name of a person
 * @return {String} Returns hello name
 */

/*
biojsvisrohartmsctest.hello = function (name) {

  return 'new hello ' + name;
};

module.exports = biojsvisrohartmsctest = function(opts){
  this.el = opts.el;
  this.el.textContent = biojsvisrohartmsctest.hello(opts.text);
};

*/
var  biojsvisrohartmsctest;

module.exports = biojsvisrohartmsctest = function(init_options)
{

    // this is just to define the options as defaults
    this.default_options = function(){

        var options = {
            target: "#graph",
            unique_id: "chip_id",
            margin:{top: 80, right: 20, bottom: 30, left: 40},
            height: 600,
            width:1060,
            x_axis_title: "Samples",
            y_axis_title: "Rohart Score"
        }
        return options;
        
    } // end this.defaultOptions

    // Derived from http://bl.ocks.org/mbostock/7555321
    this.d3_wrap = function (text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            x = text.attr("x"), // set x to be x, not 0 as in the example
            dy = parseFloat(text.attr("dy")); // no dy
            // added this in as sometimes dy is not used
            if (isNaN(dy)){
                dy =0;
            } else {
                dy = dy;
            }
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            new_dy =++lineNumber * lineHeight + dy; // added this in as well
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", new_dy+ "em").text(word).attr('text-anchor','middle');
          }
        }
      });
    } // end d3_wrap


    // setup margins in a different function
    this.setup_margins = function(graph){
        options = graph.options;
        page_options.margin = options.margin;
        page_options.width = options.width - page_options.margin.left - page_options.margin.right;
        page_options.height = options.height - page_options.margin.top - page_options.margin.bottom;

        graph.page_options = page_options;
        return graph;

    } // end this.setup_margins

    // we are trying to take into account not just the data but the lines as well
    // and we are taking into account that we want to be able to see 0 too
    this.return_y_min_max_values = function(graph){
        options = graph.options;

        // this is very specific for MSC Test graph

        lwr_min_max_values_from_data = d3.extent(options.data, 
            function(d) {   // this will go through each row of the options.data
                            // and provide a way to access the values 

                // you want to check that we use the highest and lowest values of the lines and at least stop at 0
                temp = d.lwr; // this will get the y_column (usually prediction) from the row
                // have to take into account lwr and upr
                return temp; 
            }
        );

        // do the same for upr
        upr_min_max_values_from_data = d3.extent(options.data, 
            function(d) {
                temp = d.upr;
                return temp; 
            }
        );


        min = lwr_min_max_values_from_data[0];

        max = upr_min_max_values_from_data[1];

        // set minimum to 0 if the minimum is a positive number
        // this means that the minimum number is at least 0
        // a negative number will be the only way to drop below 0
        if (min > 0) { min = 0; }

        // similarly, if the max number from the data is -ve
        // at least show 0
        if (max < 1) { max = 1; }
    
        for (key in options.horizontal_lines){
            value = options.horizontal_lines[key];
            if (value > max){ max = value }
            if (value < min){ min = value }
        }
        
        graph.force_domain =[min,max]; 
        return graph;
    }

    this.setup_y_axis = function(graph){
        padding = 30;
        svg = graph.svg;
        // ########################################## Setup Y axis labels ###################################3
        /*
            For the y axis, the scale is linear, so we create a variable called y that we can use later
            to scale and do other things. in some people call it yScale
            https://github.com/mbostock/d3/wiki/Quantitative-Scales
            The range is the range of the graph from the height to 0. This is true for all y axes
        */
        var scaleY = d3.scale.linear()
            .range([page_options.height, 0]);

        // setup the yaxis. this is later called when appending as a group .append("g")
        // Note that it uses the y to work out what it should output
        var yAxis = d3.svg.axis()
                    .scale(scaleY)
                    .orient("left");


        y_column = options.y_column;

        // d3.extent returns the max and min values of the array using natural order
        // we are trying to take into account not just the data but the lines as well
        graph = this.return_y_min_max_values(graph);
        scaleY.domain(graph.force_domain).nice();
        y_axis_legend_y = (graph.full_height - options.margin.top - options.margin.bottom)/2;

        svg.append("g")
          .attr("class", "y_axis")
          .call(yAxis) // this is actually implementing the yAxis as an axis itself
        .append("text") // this is just the text for the y axis label
          .attr("class", "label")

          // when you rotate, you have to ensure that y and x below are compensated for
          // due to the transformation itself, things can get wierd. Change the angle
          // in transform and you might have to change y and x
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -y_axis_legend_y)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .text(options.y_axis_title);


        graph.svg = svg;
        graph.scaleY = scaleY;
        graph.yAxis = yAxis;
        return graph;
    } // end this.setup_y_axis

    /*
    This includes:
    - returning vertical_lines which is the basis for calculating the vertical lines that
    separate the sample types.
    - returning the sample_id_list that allows the scaleX.domain(sample_id_list) call to 
    create the values for the x values of the samples for ordinal values 
    - also want to store the starting sample_id of a sample type as well so that we can 
    calculate the middle of the sample types to display just the sample type
    */
    this.setup_data_for_x_axis = function(graph){
        options = graph.options;
    
        sample_type_order = options.sample_type_order.split(',');
        nested_values = d3.nest()
            .key(function(d){ return d.Sample_Type })
            .sortKeys(function(a,b){return sample_type_order.indexOf(a) - sample_type_order.indexOf(b);})
            .entries(options.data);
        
        sample_id_list = new Array();
        vertical_lines = new Array(); // new object
        vert_count = 0;
        count = 0;        
        for (temp_count in nested_values){
            row = nested_values[temp_count];
            key = row.key;
            values = row.values; 
            for (count_row in values){
                sample = values[count_row];
                sample_id = sample.Replicate_Group_ID;
                sample_type = sample.Sample_Type;
                sample_id_list.push(sample_id);
                count ++;
            }   
            temp = {};
            temp['sample_type'] = key;
            temp['start_sample_id'] = values[0].Replicate_Group_ID;
            temp['end_sample_id'] = sample_id;
            vertical_lines.push(temp);
            vert_count++;
        }
        
        graph.vertical_lines = vertical_lines;
        graph.sample_id_list = sample_id_list;
        return graph;
    } // setup_data_for_x_axis



    this.setup_x_axis = function (graph){
        // ########################################## Setup X axis labels ###################################3
        page_options = graph.page_options;
        svg = graph.svg;
        options = graph.options;
        sample_id_list = graph.sample_id_list;

        // http://bost.ocks.org/mike/bar/3/
        // because we have samples along the bottom we use ordinal instead of linear
        // we also use rangeRoundBands as it gives us some flexibility
        // see here for more: https://github.com/mbostock/d3/wiki/Ordinal-Scales
        var scaleX = d3.scale.ordinal()
            .rangeRoundBands([0, page_options.width],0.4); // note that 0.4 was chosen by iterative fiddling

        /*
        http://stackoverflow.com/questions/15713955/d3-ordinal-x-axis-change-label-order-and-shift-data-position
        The order of values for ordinal scales is the order in which you give them to .domain(). 
        That is, simply pass the order you want to .domain() and it should just work.

        */
        scaleX.domain(sample_id_list);
        /*
        x.domain(options.data.map(
                function(d) {   // this will go through each row of the options.data
                                // and provide a way to access the values 
                    temp = d[options.x_column]; // this will get the x_column (usually chip_id/replicate_id) 
                    return temp;
                }
            )
        );
        */

        // setup the xaxis. this is later called when appending as a group .append("g")
        // Note that it uses the x to work out what it should output
        var xAxis = d3.svg.axis()
            .scale(scaleX)
            .orient("bottom");

        font_size = "0px"; // set this to 0 if you don't want sample_id as the labels on the x axis
        svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0," + page_options.height + ")")
            .call(xAxis)// this is actually implementing the xAxis as an axis itself
        .selectAll("text")  // text for the xaxes - remember they are on a slant 
            .attr("dx", "-2em") // when rotating the text and the size
            .style("font-size", font_size)
            .style("text-anchor", "end")
            .attr("dy", "-0.1em")
            .attr("transform", function(d) {
                return "rotate(-65)" // this is rotating the text 
                })
        .append("text") // main x axis title
            .attr("class", "label")
            .attr("x", page_options.width)
            .attr("y", +24)
            .style("text-anchor", "end")
            .text(options.x_axis_title);
        

        graph.nested_values = nested_values;
        graph.sample_id_list = sample_id_list;
        graph.vertical_lines = vertical_lines;
        graph.svg = svg;
        graph.scaleX = scaleX;

        graph = this.setup_x_axis_using_sample_types(graph);

        return graph ;
    } //end this.setup_x_axis


    // This is to make the sample types replace the sample ids
    this.setup_x_axis_using_sample_types = function (graph){
        svg = graph.svg;
        scaleX = graph.scaleX;
        vertical_lines = graph.vertical_lines;
        calculate_x_value_of_sample_types = this.calculate_x_value_of_sample_types;
        page_options = graph.page_options;
        options = graph.options;

        svg.selectAll(".sample_type_text")  // text for the xaxes - remember they are on a slant 
            .data(vertical_lines).enter()
            .append("text") // when rotating the text and the size
           .text(
                function(d){
                    temp = d.sample_type;
                    return temp;
                }
            )
            .attr("class", "x_axis_diagonal_labels")
            .style("text-anchor", "end") 
            // Even though we are rotating the text and using the cx and the cy, we need to 
            // specify the original y and x  
            .attr("y", page_options.height + 60)
            .attr("x", 
                function(d){
                   avg = calculate_x_value_of_sample_types(d,sample_id_list,scaleX);
                   return avg; 
                }
            ) // when rotating the text and the size
             .attr("transform", 
                // combination of this: http://stackoverflow.com/questions/11252753/rotate-x-axis-text-in-d3
                // and this: http://www.w3.org/TR/SVG/coords.html#TransformAttribute
                // basically, you just have to specify the angle of the rotation and you have
                // additional cx and cy points that you can use as the origin.
                // therefore you make cx and cy your actual points on the graph as if it was 0 angle change
                // you still need to make the y and x set as above
                function(d, i) {
                    // actual x value if there was no rotation
                    x_value = calculate_x_value_of_sample_types(d,sample_id_list,scaleX);
                    // actual y value if there was no rotation
                    y_value = page_options.height+60;
                    return "rotate("+options.x_axis_text_angle+","+x_value+","+y_value+")";
                }
            );
    


        graph.svg = svg;
        return graph;
    } // setup_x_axis_using_sample_types

    this.calculate_x_value_of_sample_types = function(d,sample_id_list,scaleX){
        // To get the difference, we need the sample ids to allow 
        // d3 to calculate the x axis

        var start_temp= scaleX(d.start_sample_id); 
        var end_temp = scaleX(d.end_sample_id); 
        var avg = (start_temp + end_temp)/2;
        return avg; 

    } // calculate_x_value_of_sample_types


    this.calculate_x_value_of_vertical_lines = function(d,sample_id_list,scaleX){
        // To get the difference, we need the sample ids to allow 
        // d3 to calculate the x axis
        this_sample_index = sample_id_list.indexOf(d.end_sample_id)
        next_sample_id = sample_id_list[this_sample_index +1];

        var temp = scaleX(d.end_sample_id); 
        var temp2 = scaleX(next_sample_id); 
        if (temp2 != undefined){
            var avg = (temp + temp2)/2;
        } else {
            var avg = 0;
        }
        return avg; 

    } // calculate_x_value_of_vertical_lines

    this.setup_vertical_lines = function(graph){
        svg = graph.svg;
        vertical_lines = graph.vertical_lines;
        sample_id_list = graph.sample_id_list;
        page_options = graph.page_options;
        calculate_x_value_of_vertical_lines = this.calculate_x_value_of_vertical_lines;
        
        svg.selectAll(".separator").data(vertical_lines).enter()
            .append("line")
            .attr("class", "separator") 
            .attr("x1", 
                function(d){
                   avg = calculate_x_value_of_vertical_lines(d,sample_id_list,scaleX);
                   return avg; 
                }
            ) 
            .attr("x2", 
                function(d){
                   avg = calculate_x_value_of_vertical_lines(d,sample_id_list,scaleX);
                   return avg; 
                }
            ) 
            .attr("y1", 
                function(d){
                    temp = 0;
                    return temp;
                }
            )
            .attr("y2", 
                function(d){
                    // this is to keep it within the graph
                    temp = page_options.height;
                    return temp;
                }
            )
            .attr("shape-rendering","crispEdges")
            .attr("stroke-width","1px")
            .attr("opacity","0.2")
            .attr("stroke","black");

        graph.svg = svg;
        return graph;
    } // setup_vertical_lines


    this.setup_error_bars = function (graph){
        svg = graph.svg;
        options = graph.options;
        page_options = graph.page_options;
        scaleX = graph.scaleX;
        scaleY = graph.scaleY;
        tooltip = graph.options.tooltip;
        shape_rendering = "auto";
        stroke_width = "2px";

        /*  http://bost.ocks.org/mike/circles/ 
            This pattern is so common, you’ll often see the selectAll + data + enter + append methods called 
            sequentially, one immediately after the other. Despite it being common, keep in mind that this 
            is just one special case of a data join.
        */
        /*
            This is for the upr and lwr lines and the vertical line too
        */
        width = options.error_bar_width;
        svg.selectAll(".max").data(options.data).enter()
            .append("line") // append an object line
            .attr("class", "max") 
            .attr("x1", 
                function(d){
                    var temp = scaleX(d[options.x_column]) - width; 
                    return temp;
                }
            ) 
            .attr("x2", 
                function(d){
                    var temp = scaleX(d[options.x_column]) + width; 
                    return temp;
                }
            ) 
            .attr("y1", 
                function(d){
                    temp = scaleY(d.upr);
                    return temp;
                }
            )
            .attr("y2", 
                function(d){
                    temp = scaleY(d.upr);
                    return temp;
                }
            )
            .attr("shape-rendering",shape_rendering)
            .attr("stroke-width",stroke_width)
            .attr("stroke","black")
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide)
            .style("fill", 'none') ; // color is black



        svg.selectAll(".min").data(options.data).enter()
            .append("line") // append an object line
            .attr("class", "min") 
            .attr("x1", 
                function(d){
                    var temp = scaleX(d[options.x_column]) - width; 
                    return temp;
                }
            ) 
            .attr("x2", 
                function(d){
                    var temp = scaleX(d[options.x_column]) + width; 
                    return temp;
                }
            ) 
            .attr("y1", 
                function(d){
                    temp = scaleY(d.lwr);
                    return temp;
                }
            )
            .attr("y2", 
                function(d){
                    temp = scaleY(d.lwr);
                    return temp;
                }
            )
            .attr("shape-rendering",shape_rendering)
            .attr("stroke-width",stroke_width)
            .attr("stroke","black")
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide)
            .style("fill", 'none') ; // color is black


        svg.selectAll(".vertical").data(options.data).enter()
            .append("line") // append an object line
            .attr("class", "vertical") 
            .attr("x1", 
                function(d){
                    var temp = scaleX(d[options.x_column]); 
                    return temp;
                }
            ) 
            .attr("x2", 
                function(d){
                    var temp = scaleX(d[options.x_column]); 
                    return temp;
                }
            ) 
            .attr("y1", 
                function(d){
                    temp = scaleY(d.upr);
                    return temp;
                }
            )
            .attr("y2", 
                function(d){
                    temp = scaleY(d.lwr);
                    return temp;
                }
            )
            .attr("shape-rendering",shape_rendering)
            .attr("stroke-width",stroke_width)
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide)
            .attr("stroke-width","2px")
            .attr("stroke","black")
            .style("fill", 'none') ; // color is black





        graph.svg = svg;
        return graph;
    } // end setup_error_bars


    this.setup_scatter = function(graph){

        svg = graph.svg;
        options = graph.options;
        page_options = graph.page_options;
        scaleX = graph.scaleX;
        scaleY = graph.scaleY;
        y_column = options.y_column;
        x_column = options.x_column;
        // ######################################## Setup points on the graph ####################################3
        /*  http://bost.ocks.org/mike/circles/ 
            This pattern is so common, you’ll often see the selectAll + data + enter + append methods called 
            sequentially, one immediately after the other. Despite it being common, keep in mind that this 
            is just one special case of a data join.
        */


        tooltip = options.tooltip;
        svg.call(tooltip);


        // Trying to make a quantative scale using an old way - ended up not using this anymore
        // https://github.com/mbostock/d3/wiki/Quantitative-Scales#quantize
        // http://stackoverflow.com/questions/17671252/d3-create-a-continous-color-scale-with-many-strings-inputs-for-the-range-and-dy
        // pick any number [3-9] for Reds
        // pick any number [3-11] for RdGy
        // you can check the number you can use here: https://github.com/mbostock/d3/blob/master/lib/colorbrewer/colorbrewer.js
        // end of not using this anymore


        // Or we can use something we make up
        // http://synthesis.sbecker.net/articles/2012/07/16/learning-d3-part-6-scales-colors
        var heat_map_colour = d3.scale.linear()
            .domain(options.legend_range) 
            .range(options.domain_colours);
            

        svg.selectAll(".dot") // class of .dot
          .data(options.data) // use the options.data and connect it to the elements that have .dot css
        .enter() // this will create any new data points for anything that is missing.
            .append("circle") // append an object circle
            .attr("class", "dot") 
            .attr("r", 3.5) //radius 3.5
            .attr("cx", function(d) { 
                // set the x position as based off x_column
                // ensure that you put these on separate lines to make it easier to troubleshoot
                var cx = scaleX(d[options.x_column]); 
                return cx; 
            })
            .attr("cy", function(d) { 
                // set the y position as based off y_column
                // ensure that you put these on separate lines to make it easier to troubleshoot
                var cy =  scaleY(d[options.y_column]);
                return cy;
            })
            .style("fill", 
                function (d){
                    number = d[options.data_columns_for_colour[0]]; // MSC_calls
                    total = d[options.data_columns_for_colour[1]]; // total
                    temp = number/total*100;
                    color = heat_map_colour(temp);
                    return color;
                }
            ) 
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide);


        graph.heat_map_colour = heat_map_colour;
        graph.svg = svg;
        return graph;
    }    // end of this.setup_scatter

    // Might have to use this one now for gradient
    // http://bl.ocks.org/nowherenearithaca/4449376
    this.setup_legend = function(graph){
        svg = graph.svg;
        options = graph.options;
        page_options = graph.page_options;
        heat_map_colour = graph.heat_map_colour;
        /*
            http://chimera.labs.oreilly.com/books/1230000000345/ch08.html#_cleaning_it_up
            Scott Murray has a great explanation. For instance, for the code snippet:

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + x + "," + y + ")")
                .call(xAxis);
            He explains using the following:

            Note that we use attr() to apply transform as an attribute of g. SVG transforms are quite powerful, 
            and can accept several different kinds of transform definitions, including scales and rotations. 
            But we are keeping it simple here with only a translation transform, which simply pushes the whole 
            g group over and down by some amount.

            Translation transforms are specified with the easy syntax of translate(x,y), where x and y are, 
            obviously, the number of horizontal and vertical pixels by which to translate the element.
        */

        legend_values=options.legend_values;

        legend_x_axis = page_options.width + 60;
        var legend = svg.selectAll("."+options.legend_class)
            .data(legend_values)
            .enter().append("g")
            .attr("class", options.legend_class)
            .attr("transform", 
                function(d, i) { 
                    temp =  "translate(-"+legend_x_axis+"," + i * 20 + ")"; 
                    return temp;
                }
            );

        legend.append("rect")
            .attr("x", page_options.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", 
                function(d){
                    colour = heat_map_colour(d);
                    return colour;
                }
            );

        legend.append("text")
            .attr("x", page_options.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        return graph;
    }   // setup_legend 

    /*
        This is to setup multiple horizontal lines with a label
    */
    this.setup_horizontal_lines = function(graph){
        svg = graph.svg
        options = graph.options;
        width = page_options.width;
        lines = options.lines;
        show_horizontal_line_labels = options.show_horizontal_line_labels;
        scaleY = graph.scaleY;
        y1 = y2 = scaleY(0.4); 

        svg.selectAll(".lines").data(lines).enter()
            .append("line") // append an object line
            .attr("class", "lines") 
            .attr("x1", 0) 
            .attr("x2", width) 
            .attr("y1", 
                function(d){
                    temp = scaleY(d[options.horizontal_line_value_column]);
                    return temp;
                }
            )
            .attr("y2", 
                function(d){
                    temp = scaleY(d[options.horizontal_line_value_column]);
                    return temp;
                }
            )
            .attr("shape-rendering","crispEdges")
            .attr("stroke-width","1px")
            .attr("stroke","black")
            .style("fill", 'none') ; // color is black


        graph.svg = svg;
        return graph;
    } // end setup_horizontal_lines

    this.preprocess_lines = function(graph){
        horizontal_lines = graph.options.horizontal_lines;
        lines = Array();
        for (key in horizontal_lines){
            name = key;
            value = horizontal_lines[key];
            data_line = {'value':value,'name':name};
            lines.push(data_line);
        }  
                 
        graph.options.lines = lines;
 
        return graph;
    }   // end preprocess_lines

    this.setup_svg = function (graph){
        options = graph.options;
        page_options = graph.page_options;

        full_width = options.width;
        full_height = options.height;

        graph.full_width = full_width;
        graph.full_height = full_height;

        // clear out html
        $(options.target)
            .html('')
            .css('width',full_width+'px')
            .css('height',full_height+'px');

        // setup the SVG. We do this inside the d3.tsv as we want to keep everything in the same place
        // and inside the d3.tsv we get the data ready to go (called options.data in here)
        var svg = d3.select(options.target).append("svg")
            .attr("width", full_width)
            .attr("height",full_height) 
        .append("g")
            // this is just to move the picture down to the right margin length
            .attr("transform", "translate(" + page_options.margin.left + "," + page_options.margin.top + ")");

        // this is the Main Title
        // http://bl.ocks.org/mbostock/7555321
        svg.append("text")
            .attr("x", (page_options.width / 2))             
            .attr("y", 0 - (page_options.margin.top )/2-20) 
            .attr("text-anchor", "middle")  
            .text(options.title).attr("class",options.title_class);

        // this is the Sub Title
        svg.append("text")
            .attr("x", (page_options.width / 2))             
            .attr("y", 0 - (page_options.margin.top / 2)+20)
            .attr("text-anchor", "middle")  
            .text(options.subtitle).attr("class",options.title_class);

        max_width_of_text = 800;
        suggested_width_of_text = options.width*0.7;
        if (max_width_of_text < suggested_width_of_text){
            width_of_title = max_width_of_text;
        } else {
            width_of_title = suggested_width_of_text;
        }
        svg.selectAll("."+options.title_class)
            .call(this.d3_wrap,width_of_title); 


        graph.svg = svg;
        return graph;
    } // setup_svg

    this.setup_rohart_background_text = function(graph){
        options = graph.options;
        page_options = graph.page_options;
        svg = graph.svg;

        /*  WARNING: You can't use this twice!!!! 
            you will get wrong values. This is already set 
            in the setup_y_axis so this has to be used 
        var y = d3.scale.linear()
            .range([page_options.height, 0]);
        */
        scaleY = graph.scaleY;

        font_size = "20px";
        margin_y_value_msc = 20;
        svg.append("text")
            .attr("x", (page_options.width / 2))             
            .attr("y", scaleY(options.horizontal_lines['upr'])-margin_y_value_msc)
            .text("MSC")
            .attr("text-anchor", "middle")  
            .style("font-family", "Arial")  
            .style("font-size", font_size)  
            .style("fill", "grey")  
            .attr("class",options.title_class);

        svg.append("text")
            .attr("x", (page_options.width / 2))             
            .attr("y", scaleY(options.horizontal_lines['lwr'])+margin_y_value_msc)
            .text("Non-MSC")
            .attr("text-anchor", "middle")  
            .style("font-family", "Arial")  
            .style("font-size", font_size)  
            .style("fill", "grey")  
            .attr("class",options.title_class);


 

        graph.svg = svg;
        return graph;
    } // setup_rohart_background_text

    /*  Setting up the watermark */
    this.setup_watermark = function(graph){
        svg = graph.svg;
        options = graph.options;

        svg.append("image")
            .attr("xlink:href",options.watermark)
            .attr("x", 70)
            .attr("y", -(graph.full_width - options.margin.left)) // just out of the graphs edge
            .attr("transform", "rotate(+90)")
            .attr("width", 200)
            .attr("height", 100);

        graph.svg = svg;
        return graph;
    } // setup_watermark



    /*  Setting up the graph including y and x axes */ 
    this.setup_graph = function(graph){

        // setup all the graph elements
        graph = this.setup_margins(graph);
        graph = this.setup_svg(graph);    
        graph = this.setup_y_axis(graph);
        graph = this.setup_data_for_x_axis(graph);
        graph = this.setup_x_axis(graph);
        graph = this.setup_error_bars(graph);
        graph = this.setup_scatter(graph);
        //graph = this.setup_rohart_background_text(graph);
        graph = this.setup_horizontal_lines(graph);
        graph = this.setup_watermark(graph);
        graph = this.setup_vertical_lines(graph);


        return graph;

    }  // end setup_graph  

    // run this right at the start of the initialisation of the class
    this.init = function(init_options){
        var options = this.default_options();
        options = init_options;
        page_options = {}; // was new Object() but jshint wanted me to change this
        var graph = {}; // this is a new object
        graph.options = options;

        graph = this.preprocess_lines(graph);
        graph = this.setup_graph(graph);
        graph = this.setup_legend(graph);

        var target = $(options.target);
        target.addClass('rohart_msc_graph');
    } 

    // constructor to run right at the start
    this.init(init_options);
}

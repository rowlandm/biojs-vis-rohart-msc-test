// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-rohart-msc-test");

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
    d3.tsv(data_url,function (error,data){
        
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

        var instance = new app({el: rootDiv, text: 'biojs'});
 

    }); 
 

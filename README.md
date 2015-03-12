# biojs-vis-rohart-msc-test

[![NPM version](http://img.shields.io/npm/v/biojs-vis-rohart-msc-test.svg)](https://www.npmjs.org/package/biojs-vis-rohart-msc-test) 

> BioJS component to provide a graph of the Rohart MSC Test hosted in Stemformatics

## Getting Started
Install the module with: `npm install biojs-vis-rohart-msc-test`

for more details of the options, see the working example [here](https://github.com/rowlandm/biojs-vis-rohart-msc-test/blob/master/examples/simple.js)


```javascript
var test = require('biojs-vis-rohart-msc-test');


var options = {
    background_colour: "white",
    background_stroke_colour:  "black",
    background_stroke_width:  "1px",
    circle_radius:5,  // for the scatter points
    data: data,
    data_columns_for_colour: ["MSC_calls","total_subsamplings"], //d.MSC_calls
    domain_colours : ["#FFFFFF","#7f3f98"],
    error_bar_width:10, 
    height: 1020,
    horizontal_line_value_column: 'value',
    horizontal_lines: horizontal_lines,  // this gets turned into an array of objects
    legend_class: "legend",
    legend_range: [0,100],
    margin:{top: 180, right: 120, bottom: 530, left: 200},
    sample_type_order: "BM MSC,BM erythropoietic cells CD235A+,BM granulopoietic cells CD11B+,BM hematopoietic cells CD45+,Developing cortex neural progenitor cells,Ventral midbrain neural progenitor cells,Olfactory lamina propria derived stem cells",
    show_horizontal_line_labels: true,
    subtitle1: subtitle1,
    subtitle2: subtitle2,
    target: target,
    title: title,
    title_class: "title",
    tooltip: tooltip, // using d3-tips
    unique_id: "chip_id",
    watermark:"http://www1.stemformatics.org/img/logo.gif",
    width:width, // suggest 50 per sample
    x_axis_text_angle:-45, 
    x_axis_title: "Samples",
    x_column:'Replicate_Group_ID',
    x_middle_title: 325,
    y_axis_title: "Rohart Score",
    y_column:'prediction' // d.prediction
}


var instance = new app(options);
```

## Documentation

#### Running the instance


## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/rowlandm/biojs-vis-rohart-msc-test/issues).

## License 
This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2015, rowlandm

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.

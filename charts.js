function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log("metadata:", metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log("metadata_result:", result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var otu_data = data.samples;
    console.log("otu_data:", otu_data);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = otu_data.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray:", resultArray);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("result:", result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values
    console.log("sample_values", result.sample_values)


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    console.log("yticks", yticks);
  

    var xticks = sample_values.slice(0, 10).map(id => id).reverse();
    console.log("xticks", xticks);

    // 8. Create the trace for the bar chart. 4
    var barData = [
      {
      x: xticks,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: 'h'
      }
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacterial Cultures Found",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

      
      // Bubble charts
      // 1. Create the trace for the bubble chart.
      var bubbleData = [
        {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: [1, 10, 100, 1000, 2500, 5000, 10000, 15000, 20000, 25000, 30000, 35000],
          sizemode: 'area',
          color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)','hsl(0,100,40)', 'hsl(33,100,40)', 'hsl(66,100,40)', 'hsl(99,100,40)'],
          sizeref: 2,
        }
      }
      ];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacterial Cultures Per Sample",
        showlegend: false,
        xaxis: {title: 'OTU ID'},
        height: 750,
        width: 1000
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    });
}



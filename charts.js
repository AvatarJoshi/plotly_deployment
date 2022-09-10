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
    console.log(sampleNames[0])
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
    // console.log("metadata:", metadata);
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

    var metadata = data.metadata;
    console.log("metadata:", metadata);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = otu_data.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray:", resultArray);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("metadataArray:", metadataArray);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("result:", result);
    
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataArray[0];
    console.log("metadataResult", metadataResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(metadataResult.wfreq)
 


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
      const bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Portland',
  
          },
        },
      ];

      // 2. Create the layout for the bubble chart.
      const bubbleLayout = {
        title: 'Bacterial Cultures Per Sample',
        showlegend: false,
        xaxis: { title: 'OTU ID' },
        margin: {t: 30}
      };

      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


      // Deliverable 3: 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {  
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue"},
            steps: [
              { range: [0, 10], color: "lightblue" },
            ],   
            bar: { color: "orange" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",


          }
        }
      ];
      
      // Deliverable 3: 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, height: 500, margin: { t: 0, b: 0 }
      };
  
      // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}



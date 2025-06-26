
//change dataURL to whatever link you need
const dataURL = "https://blw-dataviz-data.s3.us-east-2.amazonaws.com/election-confidence-and-legitimacy/election_confidence_and_legitimacy.gz"

function drawViz(data) {
  //write all your visualization code inside this function.
  //This function will called when the page loads and the data has been successfully
  //fetched.  At that point, your data will be in the parameter `data`


  //change frameClass below to whatever class you've written into index.html
  const frameClass = ".svg-frame"
  const frameWidth = parseFloat(d3.select(frameClass).style("width"))
  const frameHeight = parseFloat(d3.select(frameClass).style("height"))

  //insert the svg, set width and height, and put it in a d3 selection `svg`
  const svg = d3.select(frameClass)
    .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")

  //set margins and make scales for arbitrary position in main drawing area
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
  const xScale = d3.scaleLinear([0, 1], [margin.right, frameWidth - margin.left])
  const yScale = d3.scaleLinear([0, 1], [frameHeight - margin.bottom, margin.top])

  

}


async function getData() {
  try {
    const response = await fetch(dataURL)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json()
    console.log(data)
    drawViz(data)
  } catch (error) {
    console.error(error.message)
  }
}
getData()


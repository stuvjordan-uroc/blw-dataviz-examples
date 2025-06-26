
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


  //Create the data arrays we need for the viz
  //Of course you'll have to make changes here to fit your particular data.
  const labelData = [
    "Definitely the rightful winner",
    "Probably the rightful winner",
    "Probably not the rightful winner",
    "Definitely not the rightful winner"
  ]
  const pointData = data.data
    .map((el) => ({
      pid3: el[15],
      response: el[19]
    }))//select the columns you want
    .filter((el) => (["Democrat", "Republican"].includes(el.pid3)))//filter out rows with independents or missing pid3
    .filter((el) => (labelData.includes(el.response)))//filter out rows with missing responses
  console.log(pointData)

  //Create selections for the labels and points and bind the data.
  //Each time a button is pushed, we will update what's displayed by
  //manipulating these selections
  const labels = svg.selectAll("text.response-label")
    .data(labelData)
  const points = svg.selectAll("circle.data-point")
    .data(pointData)
  
  //Make response to key and key to response maps so we can make a proportions object.
  //you'll have to change these to fit your case
  const responseToKey = new Map([
    ["Definitely the rightful winner", "def"],
    ["Probably the rightful winner", "prob"],
    ["Probably not the rightful winner", "probnot"],
    ["Definitely not the rightful winner", "defnot"]
  ])
  const keyToResponse = new Map([
    ["def", "Definitely the rightful winner"],
    ["prob", "Probably the rightful winner"],
    ["probnot", "Probably not the rightful winner"],
    ["defnot", "Definitely not the rightful winner"]
  ])
  //make the proportion object
  const proportion = {
    all: Object.fromEntries(keyToResponse.entries()),
    republicans: Object.fromEntries(keyToResponse.entries()),
    democrats: Object.fromEntries(keyToResponse.entries())
  }
  
  labelData.forEach((response) => {
    //compute the proportion for the whole group
    proportion.all[responseToKey.get(response)] = pointData.filter((row) => (row.response === response)).length/pointData.length     
    //compute the proportion for the dems
    const dems = pointData.filter((row) => (row.pid3 === "Democrat"))
    proportion.democrats[responseToKey.get(response)] = dems.filter((row) => (row.response === response)).length/dems.length
    //compute the proportion for the reps
    const reps = pointData.filter((row) => (row.pid3 === "Republican"))
    proportion.republicans[responseToKey.get(response)] = reps.filter((row) => (row.response === response)).length/reps.length
  })
  
  /*
  The proprtion object can now be used like this:

  proportion.republicans[responseToKey.get("Definitely not the rightful winner")]
  */
  
  console.log(proportion)


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


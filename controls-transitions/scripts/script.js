import { makeProportions } from "./modules/makeproportions.js"
import { makeVerticalScale } from "./modules/makeverticalscale.js"

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
  //Note that it is important that you put the "highest" response first in the labelData
  //array, and the "lowest" response last.
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
  const labelsSelection = svg.selectAll("text.response-label")
    .data(labelData)
  const pointsSelection = svg.selectAll("circle.data-point")
    .data(pointData)
  
  //make the proportions map
  /*
    This uses the function makeProportions imported from modules/makeproportions.js
    As you can see, you pass that function...
    1. The array with the response labels
    2. An array with the parties you want to include
    3. The point data
    4. the key in the point data object that points to the response of each row
    5. the key in the point data object that points the pid

    
    What's returned is a Map that you can use to get proportions like this:
    
    proportion.get("Democrat").get("Probably the rightful winner")

    This Map includes proportions for the whole group that you an access like this:

    proportion.get("all").get("Probably the rightful winner")

    For docs on the Map object see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  */
  const proportion = makeProportions(labelData,["Democrat", "Republican"], pointData, "response", "pid3")
  console.log(proportion)

  //set up the vertical scales
  const verticalPadding = 20
  //the following is not working
  const vScale = makeVerticalScale(verticalPadding, labelData, proportion, yScale)
  console.log(vScale)
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


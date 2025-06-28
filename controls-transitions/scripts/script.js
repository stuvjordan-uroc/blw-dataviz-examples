import { makeProportions } from "./modules/makeproportions.js"
import { makeVerticalScale } from "./modules/makeverticalscale.js"
import { drawStart } from "./modules/drawstart.js"
import { drawFactory } from "./modules/drawfcns.js"

//change dataURL to whatever link you need
//const dataURL = "https://blw-dataviz-data.s3.us-east-2.amazonaws.com/election-confidence-and-legitimacy/election_confidence_and_legitimacy.gz"
const dataURL = "data/election_confidence_and_legitimacy.gz"


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

  //for quicker dev...sample 1000 rows from the data
  const sampleData = new Array()
  for (let idx = 0; idx < 1000; idx++) {
    const sampleIndex = Math.floor(pointData.length * Math.random())
    sampleData.push({
      pid3: pointData[sampleIndex].pid3,
      response: pointData[sampleIndex].response
    })
    pointData.splice(sampleIndex, 1)
  }


  console.log(sampleData)

  //Create selections for the labels and points and bind the data.
  //Each time a button is pushed, we will update what's displayed by
  //manipulating these selections
  const labelsSelection = svg.selectAll("text.response-label")
    .data(labelData)
  //const pointsSelection = svg.selectAll("circle.data-point")
  //  .data(pointData)

  //for faster dev:

  const pointsSelection = svg.selectAll("circle.data-point")
    .data(sampleData)

  console.log("rows with no pid3:", sampleData.filter(el => (["Democrat", "Republican"].includes(el.pid3))))

  //make the proportions map
  /*
    This uses the function makeProportions imported from modules/makeproportions.js
    As you can see, you pass that function...
    1. The array with the response labels *ELEMENTS MUST BE IN ORDER FROM HIGHEST TO LOWEST!!!!*
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
  const proportion = makeProportions(labelData, ["Democrat", "Republican"], pointData, "response", "pid3")
  console.log(proportion)

  //set up the vertical scales
  /*
    This uses the function makeVerticalScale imported above from modules/makeverticalscale.js
    It's parameters are:

    + padding -- a number giving the vertical space between the segments
    + proportion -- the proportion Map you created in the previous step
    + yScale -- the d3 linear scale for positioning (bottom to top) in the main plot area
  */
  const verticalPadding = 20
  const vScale = makeVerticalScale(verticalPadding, proportion, yScale)
  console.log(vScale)

  //ok, here we go!
  /*
    we'll start by rendering the "starting position" of the points, which will
    simply have all of them uniformly jittered across the entire main drawing area.

    Do this by calling drawStart, imported above from modules/drawstart.  drawStart
    takes 4 argumnets:
    + pointsSelection -- the d3 selection with the points data joined to it.
    + xScale -- the linear scale covering the x axis of the main drawing area
    + yScale -- the linear scale covering the y axis of the main drawing area
    + partyKey -- the key in the data pointing to the party id (e.g. "pid3")

  */

  drawStart(pointsSelection, xScale, yScale, "pid3")



  d3.select(".controls")
    .on("click", (event) => {
      switch (event.target.id) {
        case "demOnly":
          console.log("left button pushed")
          pointsSelection
            .attr("cx", 30)
          break
        case "together":
          console.log("middle button pushed")
          pointsSelection
            .attr("cx", 150)
          break
        case "compare":
          console.log("right button pushed")
          pointsSelection
            .attr("cx", 270)
          break
        case "repOnly":
          console.log("right button pushed")
          pointsSelection
            .attr("cx", 270)
          break
        default:
          throw new Error("button click with an unrecognized id:", event.target.id)
      }
    })

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


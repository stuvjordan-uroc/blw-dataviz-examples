

function drawViz(data) {
  console.log(data)
  //frame, svg, margins, scales
  const frameClass = ".svg-frame"
  const frameWidth = parseFloat(d3.select(frameClass).style("width"))
  const frameHeight = parseFloat(d3.select(frameClass).style("height"))
  const svg = d3.select(frameClass)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
  const xScale = d3.scaleLinear([0, 1], [margin.right, frameWidth - margin.left])
  const yScale = d3.scaleLinear([0, 1], [frameHeight - margin.bottom, margin.top])

  //create selection of data points and draw in initial position
  const pointsSelection = svg.selectAll("circle.data-point")
    .data(data)
    .join("circle")
      .attr("class", d => `data-point ${d.pid3.toLowerCase()}`)
      .attr("cx", d => xScale(0) + Math.random() * (xScale(1) - xScale(0)))
      .attr("cy", d => yScale(1) + Math.random() * (yScale(0) - yScale(1)))

    

  //listener and handler
  d3.select(".controls")
    .on("click", (event) => {
      console.log(`${event.target.id} pushed`)
      switch (event.target.id) {
        case "demOnly":
          pointsSelection
            .classed("hidden", d => d.pid3 === "Republican")
            .classed("democrat", d => d.pid3 === "Democrat")
            .classed("republican", false)
            .attr("cx", xScale(0.25))
          break
        case "together":
          pointsSelection
            .classed("hidden", false)
            .classed("democrat", d => d.pid3 === "Democrat")
            .classed("republican", d => d.pid3 === "Republican")
            .attr("cx", xScale(0.45))
          break
        case "compare":
          pointsSelection
            .classed("hidden", false)
            .classed("democrat", d => d.pid3 === "Democrat")
            .classed("republican", d => d.pid3 === "Republican")
            .attr("cx", xScale(0.65))
          break
        case "repOnly":
          pointsSelection
            .classed("hidden", d => d.pid3 === "Democrat")
            .classed("democrat", false)
            .classed("republican", d => d.pid3 === "Republican")
            .attr("cx", xScale(0.85))
          break
        default:
          throw new Error("button click with an unrecognized id:", event.target.id)
      }
    })  

}

async function getData() {

  const parties = ["Democrat", "Republican"]
  const responses = ["Definitely the rightful winner", "Probably the rightful winner", "Definitely not the rightful winner", "Probably not the rightful winner"]
  const data = new Array(100).fill(1).map((el) => ({
    pid3: parties[Math.floor(Math.random()*parties.length)],
    response: responses[Math.floor(Math.random()*responses.length)]
  }))

  drawViz(data)
}
getData()
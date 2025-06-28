export const draw = {
  demOnly: () => { console.log("drawing dems only") },
  together: (pointsSelection, vScale, xScale, responseKey, partyKey) => {
    pointsSelection.join(
      update => update
        .attr("cx", d => xScale(0) + Math.random() * (xScale(1) - xScale(0)))
        .attr("cy", d => vScale.get("all").get(d[responseKey]).top + Math.random() * vScale.get("all").get(d[responseKey]).height)
    )
  },
  compare: () => { console.log("drawing compare") },
  repOnly: () => { console.log("drawing reps only") }
}

export function drawFactory(pointsSelection, vScale, xScale, responseKey, partyKey) {
  return ({
    demOnly: () => { console.log("drawing dems only") },
    together: () => {
      console.log("show together clicked!")
      console.log(pointsSelection)
      pointsSelection
        .join(
          enter => enter
              .attr("cx", xScale(0.5))
              .attr("cy", d => vScale.get("all").get(d[responseKey]).top)
        )
    },
    compare: () => { console.log("drawing compare") },
    repOnly: () => { console.log("drawing reps only") }
  })
}
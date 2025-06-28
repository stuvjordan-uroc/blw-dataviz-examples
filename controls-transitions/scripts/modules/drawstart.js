export function drawStart(pointsSelection, xScale, yScale, partyKey){
  pointsSelection.join(
    enter => enter.append("circle")
        .attr("class", d => `data-point ${d[partyKey].toLowerCase()}`)
        .attr("cx", d => xScale(0) + Math.random()*(xScale(1) - xScale(0)))
        .attr("cy", d => yScale(1) + Math.random()*(yScale(0) - yScale(1))),
    update => update
        .attr("class", d => `data-point ${d[partyKey].toLowerCase()}`)
        .attr("cx", d => xScale(0) + Math.random()*(xScale(1) - xScale(0)))
        .attr("cy", d => yScale(1) + Math.random()*(yScale(0) - yScale(1))),
    exit => exit.remove()
  )
    
}
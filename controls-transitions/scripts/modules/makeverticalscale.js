export function makeVerticalScale(padding, proportions, yScale) {
  //note that we assume that the responses in the responses
  //parameter are ordered for "highest" to "lowest"!
  const verticalScale = new Map()
  const totalSegmentHeight = yScale(0)-yScale(1)-(proportions.size-1)*padding
  proportions.forEach((groupProportionsMap, group) => { //Map.forEach takes a function (value, key) => {}
    const groupScale = new Map()
    const responsesArray = Array.from(groupProportionsMap.keys())
    for (let idx = 0; idx <= groupProportionsMap.size - 1; idx++){
      groupScale.set(responsesArray[idx], {
        top: (idx === 0) ? yScale(1) : groupScale.get(responsesArray[idx-1]).top + groupScale.get(responsesArray[idx-1]).height + padding,
        height: groupProportionsMap.get(responsesArray[idx])*totalSegmentHeight,  
      })
    }
    verticalScale.set(group, groupScale)
  })
  return verticalScale
}
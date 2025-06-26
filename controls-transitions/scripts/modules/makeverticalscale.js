export function makeVerticalScale(padding, responses, proportions,yScale) {
  //note that we assume that the responses in the responses
  //parameter are ordered for "highest" to "lowest"!
  const verticalScale = new Map()
  const totalSegmentHeight = yScale(0)-yScale(1)-(responses.length-1)*padding
  proportions.forEach((groupProportionsMap, group, proportionsMap) => {
    const groupScale = new Map()
    for (let idx = 0; idx++; idx <= responses.length - 1){
      //compute coordinate of top of segment
      const top = (idx === 0) ? yScale(1) : groupScale.get(responses[idx-1]).bottom + padding
      groupScale.set(responses[idx], {
        height: groupProportionsMap.get(responses[idx])*totalSegmentHeight,
        bottom: top + groupProportionsMap.get(responses[idx])*totalSegmentHeight
      })
    }
    verticalScale.set(group, groupScale)
  })
  return verticalScale
}
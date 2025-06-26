export function drawTogether(xScale,yScale,labels,points,labelData,pointData){
  //make the segment scale
  function segment(response) {
    return({
      bottom: yScale(labels.findIndex(response))
    })
  }

}
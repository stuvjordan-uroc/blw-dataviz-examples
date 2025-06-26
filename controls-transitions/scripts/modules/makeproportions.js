export function makeProportions(responses, parties, data, responseKey, partyKey){
  const proportionsMap = new Map()
  //make "all" entry
  const allSize = data.length
  const allMap = new Map()
  responses.forEach((response) => {
      allMap.set(response, data.filter((row) => (row[responseKey] === response)).length/allSize)

  })
  proportionsMap.set("all",allMap)
  parties.forEach((party) => {
    const partyMap = new Map()
    //compute size of party
    const partyData = data.filter((row) => (row[partyKey] === party))
    const partySize = partyData.length
    responses.forEach((response) => {
      partyMap.set(response, partyData.filter((row) => (row[responseKey] === response)).length/partySize)
    })
    proportionsMap.set(party, partyMap)
  })
  return proportionsMap
}
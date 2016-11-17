function parseColumn(arr){
  var values = arr.filter(d => (d !=='' && d !== 'NaN'))
  var valueType = arrType(values)
  if (valueType === "float" || valueType === "int") {
      values = values.map(d => +d)
      var range = [d3.min(values), d3.max(values)]
      var mean = d3.mean(values).toFixed(3)
      var median = d3.median(values)
      return {type : valueType, range : range, mean: mean, median : median}
  }
  if (valueType ==="category") {
    var categories = arr.unique()
    return {type : valueType, categories : categories}
  }
  return {type : valueType}

}

function arrType(arr){
    var isNumber = true
    arr.map(value => {if (isNaN(value)) isNumber = false})
    if (isNumber) {
      isFloat = false
      arr.map(value => {if (!isInt(+value)) isFloat = true})
      return (isFloat) ? "float" : (arr.unique().length === arr.length) ? "index" : "int"
    }
    if (arr.unique().length === arr.length) return "index"
    return "category"

}

function isInt(n) {
   return n % 1 === 0;
}

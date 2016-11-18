var vm = new Vue({
  el: '#main',
  data: {
    data: [],
    targetFeature : '',
    show : {
      comparison: false,
      univariate: false
    },
    comparison : {
      pearson : 0,
    },
    plot : null,


  },
  computed: {
    columns() {
      var vm = this
      if (vm.data.length ===0) return
      return Object.keys(vm.data[0])
    },
    featureData() {
      var vm = this
      var res = {}
      if (!vm.columns) return
      vm.columns.map(col => {
        res[col] = parseColumn(vm.data.map(d => d[col]))
        if (res[col].type === "int" || res[col].type === "float") vm.data.map(d => {d[col] = + d[col]; return d})
      })
      return res
    },
    dataInfo(){
      var vm = this
      var text = {}
      if (!vm.columns) return
      vm.columns.map(col => {
        var featureData = vm.featureData[col]
        if (featureData.type === "float" || featureData.type === "int")  text[col] = " Type : " + featureData.type + " Range : [" + featureData.range + "] Mean : " + featureData.mean + " Median : " + featureData.median
        else if (featureData.type === "category") text[col] = " Type : " + featureData.type + " Number of cat : " + featureData.categories.length
        else text[col] = " Index"
      })
      return text

    },
    features() {
      var vm = this
      if (!vm.featureData) return
      return Object.keys(vm.featureData).filter(k => (vm.featureData[k].type !== "index" && k!== vm.targetFeature))
    },
    numericalFeatures() {
      var vm = this
      if (!vm.featureData) return
      return vm.features.filter(f => (vm.featureData[f].type === "float" ||vm.featureData[f].type === "int"))
    }
    // ranges() {
    //   var vm = this
    //   var result = {}
    //   if (!vm.columns) return
    //   vm.columns.map(col => {
    //     var array = vm.data.map(d => parseInt(d[col]))
    //     result[col] = [d3.min(array),d3.max(array)]
    //   })
    //   return result
    // },

  },
  methods : {
    explore : function(str){
      var vm = this
      Object.keys(vm.show).map(k => vm.show[k] = false)
      if (vm.comparisonTable) vm.comparisonTable.destroy()

      vm.show[str] = true
    },
    compareFeatures : function(){
      var vm = this
      var feature1 = document.querySelector("#feature1").value
      var feature2 = document.querySelector("#feature2").value

      var data = vm.data.map(d => ({x : d[feature1], y : d[feature2], target : d[vm.targetFeature]}))
      vm.comparison["pearson"] = pearson([data.map(d=>+d.x),data.map(d=>+d.y)],0,1)
      var ds = new Plottable.Dataset(data)
      var xScale = new Plottable.Scales.Linear().domain(vm.featureData[feature1].range);
      var yScale = new Plottable.Scales.Linear().domain(vm.featureData[feature2].range);
      var colorScale = new Plottable.Scales.Color()
      colorScale.domain(vm.featureData[vm.targetFeature].categories).range(["blue","red","green","black"])
      var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
      var yAxis = new Plottable.Axes.Numeric(yScale, "left");
      var xLabel = new Plottable.Components.AxisLabel(feature1, "0");
      var yLabel = new Plottable.Components.AxisLabel(feature2, "270");
      if (vm.comparisonTable) vm.comparisonTable.destroy()
      plot = new Plottable.Plots.Scatter();
      plot.addDataset(ds);
      plot.x(d => d.x, xScale)
          .y(d => d.y, yScale)
          .attr("fill", d => d.target, colorScale)

      vm.comparisonTable = new Plottable.Components.Table([[yLabel, yAxis, plot],
                                            [null, null, xAxis],
                                            [null, null, xLabel]]);
      vm.comparisonTable.renderTo("svg#scatter")


    }



  },
})


function selectTarget(){
    var form = document.querySelector("#selectTarget")
    vm.targetFeature = form.value
    console.log(vm.targetFeature)

  }
function upload() {
    var x = document.getElementById("fileButton");
    if (!x.files) return
    if (x.files.length === 0) return
    var file = x.files[0]

    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        var csv = e.target.result

        data = d3.csv.parse(csv)
        vm.data = data

      };
    })(file);

    reader.readAsText(file);

}

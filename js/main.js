var vm = new Vue({
  el: '#main',
  data: {
    data: [],
    targetFeature : '',
    show : {
      comparison: false,
      univariate: false
    },

  },
  computed: {
    featureData() {
      var vm = this
      var res = {}
      if (!vm.data.columns) return
      vm.data.columns.map(col => {
        res[col] = parseColumn(vm.data.map(d => d[col]))
      })
      return res
    },
    dataInfo(){
      var vm = this
      var text = {}
      if (!vm.data.columns) return
      vm.data.columns.map(col => {
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
    }
    // ranges() {
    //   var vm = this
    //   var result = {}
    //   if (!vm.data.columns) return
    //   vm.data.columns.map(col => {
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
      vm.show[str] = true
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

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var csv = e.target.result
        vm.data = d3.csvParse(csv)

      };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsText(file);

}

var vm = new Vue({
  el: '#main',
  data: {
    data: [],

  },
  computed: {
    ranges() {
      var vm = this
      var result = {}
      if (!vm.data.columns) return
      vm.data.columns.map(col => {
        var array = vm.data.map(d => parseInt(d[col]))
        result[col] = [d3.min(array),d3.max(array)]
      })
      return result
    },

  },
  methods : {

  },
})



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

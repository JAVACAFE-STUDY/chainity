
function listTransactions() {
  $.get("/getTransactions", function(logs){
    for (var idx in logs) {
      var log = logs[idx];
      $('<tr><td>'+log.args.from+'</td><td>'+log.args.to+'</td><td>'+log.args.value+'</td></tr>').appendTo('tbody');
    }
  });
}

listTransactions();


function listTransactions() {
  $.get("/getTransactions", function(results){
    for (var idx in results) {
      var result = results[idx];
      $('<tr><td>'+result.from+'</td><td>'+result.to+'</td><td>'+result.token+'</td></tr>').appendTo('tbody');
    }
  });
}

listTransactions();

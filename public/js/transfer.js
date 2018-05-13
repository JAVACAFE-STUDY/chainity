$.get("/api/getCoinbase", function(data){
  $("#myAddress").val(data);
});

function transfer() {
  $.get("/api/transfer?from=" + $("#myAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").html('<a target="_blank" href="https://rinkeby.etherscan.io/tx/'+data+'">'+data+'</a>');
  }).fail(function(xhr, status, error) {
    alert(xhr.responseText);
  });
}

function transferFrom() {
  $.get("/api/transferFrom?my=" + $("#myAddress").val() + "&from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").html('<a target="_blank" href="https://rinkeby.etherscan.io/tx/'+data+'">'+data+'</a>');
  }).fail(function(xhr, status, error) {
    alert(xhr.responseText);
  });
}
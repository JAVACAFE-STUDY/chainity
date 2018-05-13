$.get("/api/getCoinbase", function(data){
  $("#myAddress").val(data);
});

function approve() {
  $.get("/api/approve?from=" + $("#myAddress").val() + "&spender=" + $("#senderAddress").val() + "&value=" + $("#senderValue").val(), function(data){
    $("#result").html('<a target="_blank" href="https://rinkeby.etherscan.io/tx/'+data+'">'+data+'</a>');
  });
}

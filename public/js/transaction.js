function approve() {
  $.get("/api/appove?from=" + $("#myAddress").val() + "&spender=" + $("#senderAddress").val() + "&value=" + $("#senderValue").val(), function(data){
    $("#result").text(data);
  });
}

function transferFrom() {
  $.get("/api/transferFrom?my=" + $("#myAddress").val() + "&from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").text(data);
  });
}

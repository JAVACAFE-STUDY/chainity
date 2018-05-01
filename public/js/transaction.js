function sendTransfer() {
  $.get("/sendTransfer?from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").text(data);
  });
}

function sendApprove() {
  $.get("/sendApprove?from=" + $("#myAddress").val() + "&spender=" + $("#senderAddress").val() + "&value=" + $("#senderValue").val(), function(data){
    $("#result").text(data);
  });
}

function sendTransferFrom() {
  $.get("/sendTransferFrom?my=" + $("#myAddress").val() + "&from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").text(data);
  });
}

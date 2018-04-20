
function sendTranaction() {
  $.get("/sendTransaction?from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    $("#result").text(data);
  });
}

function sendApprove() {
  $.get("/sendApprove?spender=" + $("#senderAddress").val() + "&value=" + $("#senderValue").val(), function(data){
    $("#result").text(data);
  });
}

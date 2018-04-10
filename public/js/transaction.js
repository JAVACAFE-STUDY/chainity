
function sendTranaction() {
  $.get("/sendTransaction?from=" + $("#fromAddress").val() + "&to=" + $("#toAddress").val() + "&value=" + $("#transactionValue").val(), function(data){
    console.log(data);
  });
}

function sendApprove() {
  $.get("/sendApprove?spender=" + $("#senderAddress").val() + "&value=" + $("#senderValue").val(), function(data){
    console.log(data);
  });
}

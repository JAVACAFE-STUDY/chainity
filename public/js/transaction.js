
function sendTranaction() {
  $.get("/sendTransaction?from=0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06&to=0xE125665F3aDb9BA3013E218057C891dd2d79Ee8a&value=100", function(data){
    $("#balance_of_account0").text(data);
  });
}

function sendApprove() {
  $.get("/sendApprove?spender=0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06&value=100", function(data){
    $("#balance_of_account0").text(data);
  });
}


$.get("/api/getAccounts", function(accounts) {
  console.log(accounts);
  $.each(accounts, function( index, value ) {
    $('#'+value.toUpperCase()).append(' (mine)');
  });
})
.fail(function(xhr, status, error) {
    alert(xhr.responseText);
});

function setBalanceOfAccount(id, address) {
  $.get("/api/getBalancOf?address=" + address, function(data){
    $("#"+id).text(data);
  });
}

setBalanceOfAccount("balance_of_contract", "0x9bf53B7c67b3a43E6982243Befc81aDe27B7443F");
setBalanceOfAccount("balance_of_account0", "0x7CEF57FD7FAa78c4132e7c748115528e187042a4");
setBalanceOfAccount("balance_of_account1", "0x1f6AFf903757d338AE80F1E8fE66b8668D816d4C");
setBalanceOfAccount("balance_of_account2", "0xE125665F3aDb9BA3013E218057C891dd2d79Ee8a");
setBalanceOfAccount("balance_of_account3", "0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06");

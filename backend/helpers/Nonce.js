var nonces = {};

function getFreshNonce(address, systemNonce) {
	if(nonces[address]) {
		nonces[address] = (nonces[address] < systemNonce) ? systemNonce : nonces[address]+1;
	} else {
		nonces[address] = systemNonce;
	}
	return nonces[address];
}

module.exports = { getFreshNonce};
const { verify } = require('snarkjs').groth16;

// I added this file as a wrapper so that consuming code doesn't need to add
// snarkjs as a dependency
module.exports = async function verifyProof({proof, publicSignals, verifierJson}) {
    return verify(verifierJson, publicSignals, proof);
};
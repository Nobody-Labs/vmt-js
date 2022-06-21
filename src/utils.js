const { BigNumber } = require("@ethersproject/bignumber");
const { keccak256 } = require("@ethersproject/keccak256");
const { randomBytes } = require("@ethersproject/random");
const { utils: { stringifyBigInts }, Scalar, ZqField } = require("ffjavascript");

// max snark field element
const F = new ZqField(Scalar.fromString(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
));

// zero as string
function zero() {
    return BigNumber.from(keccak256(Buffer.from('twister')))
        .mod(F.p.toString())
        .toString()
        ;
}

// empty nodes in the tree, each level gets a unique zero hash
function calculateZeros({hasher, levels}) {
    // keccak256("twister") % 21888242871839275222246405745257275088548364400416034343698204186575808495617
    // var zero_value = "12203036764200780499285592342002735938107858004988502615570892756707598521180";
    var zero_value = zero();
    const result = [zero_value];
    for (let i = 0; i < levels; i++) {
        zero_value = hasher([zero_value, zero_value]);
        result.push(zero_value.toString());
    }
    return result;
}

// convert to field element
function toFE(value) {
    if (value instanceof Uint8Array)
        value = BigNumber.from(value)
    return F.e(value.toString());
};

// stringify data for groth16 prover
function toProofInput({startIndex, leaves, startSubtrees, endSubtrees}) {
    return stringifyBigInts({
        startIndex,
        leaves,
        startSubtrees,
        endSubtrees
    });
};

// this is a solidity calldata optimization
function flattenProof(proof) {
    return [
        proof.pi_a[0], proof.pi_a[1], proof.pi_b[0][1], proof.pi_b[0][0],
        proof.pi_b[1][1], proof.pi_b[1][0], proof.pi_c[0], proof.pi_c[1]
    ];
};

// the solidity contract holds the startIndex, leaves, and filledSubtrees.
function toSolidityInput({ proof, publicSignals, sliceIndex }) {
    return { p: flattenProof(proof), newSubtrees: publicSignals.slice(sliceIndex) };
};

// unsafe because they are not cryptographic commitments, just dummy values.
function unsafeRandomLeaves(length) {
    var leaves = new Array(length);
    for (let i = 0; i < length; i++) {
        leaves[i] = randomBytes(31);
    }
    return leaves.map(toFE);
};

module.exports = {
    F,
    calculateZeros,
    flattenProof,
    unsafeRandomLeaves,
    toFE,
    toProofInput,
    toSolidityInput,
    zero,
};
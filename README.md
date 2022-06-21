# vmt-js
Library for constructing computational integrity proofs to advance the state of verifiable merkle trees. Now using poseidon!

## Lifted files
I took the below files into this repository to avoid using the older version of ffjavascript. I modified the mimcsponge file to be similar to the poseidon implementation.

## [mimcsponge.js](./src/mimcSponge.js)
Lifted directly from a deprecated version of [circomlib](https://github.com/iden3/circomlib/blob/v0.5.5/src/mimcsponge.js), modified to use ethers instead of web3-utils.

## [poseidon.js](./src/poseidon.js)
Lifted directly from a deprecated version of [circomlib](https://github.com/iden3/circomlib/blob/v0.5.5/src/poseidon.js)

## [poseidon_constants_opt.json](./src/poseidon_constants_opt.json)
Same as above: from [circomlib](https://github.com/iden3/circomlib/blob/v0.5.5/src/poseidon_constants_opt.js)

## [merkleTree.js](./src/merkleTree.js)
I added a wrapper class for tornado's [fixed merkle tree library](https://github.com/tornadocash/fixed-merkle-tree), to be consistent with the hash functions in this project.
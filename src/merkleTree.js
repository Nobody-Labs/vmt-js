const { MerkleTree: FixedMerkleTree } = require("fixed-merkle-tree");
const { zero } = require('./utils');

module.exports = class MerkleTree extends FixedMerkleTree {
    constructor({ hasher, levels = 20, leaves = [] }) {
        super(levels, leaves, {
            hashFunction: (left, right) => hasher([left, right]),
            zeroElement: zero(),
        });
    };
};
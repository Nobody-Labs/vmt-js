const {
    calculateNextRoot,
    mimcSponge,
    poseidon,
    utils,
    MerkleTree
} = require('../index');

(async function() {
    const leaves = utils.unsafeRandomLeaves(16);

    const mimcMerkleTree = new MerkleTree({ hasher: mimcSponge, leaves });
    const { root: mimcCalculateNextRoot } = calculateNextRoot({ hasher: mimcSponge, leaves });
    console.log('root [MerkleTree] - MiMC'); console.log(mimcMerkleTree.root);
    console.log('root  [VMTreeLib] - MiMC'); console.log(mimcCalculateNextRoot);
    console.log('proof - MiMC', mimcMerkleTree.proof(leaves[4]));

    const poseidonMerkleTree = new MerkleTree({ hasher: poseidon, leaves });
    const { root: poseidonCalculateNextRoot } = calculateNextRoot({ hasher: poseidon, leaves });
    console.log('root [MerkleTree] - Poseidon'); console.log(poseidonMerkleTree.root);
    console.log('root  [VMTreeLib] - Poseidon'); console.log(poseidonCalculateNextRoot);
    console.log('proof - Poseidon', poseidonMerkleTree.proof(leaves[4]));
})();
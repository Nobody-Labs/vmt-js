const {
    calculateNextRoot,
    mimcSponge,
    utils
} = require('../index');

(function () {
    const randomLeaves = utils.unsafeRandomLeaves(10);
    const { filledSubtrees: initialTrees } = calculateNextRoot({hasher: mimcSponge});
    const treeSnapshots = [initialTrees];
    randomLeaves.forEach(
        (leaf, startIndex) => 
            treeSnapshots.push(calculateNextRoot({
                hasher: mimcSponge,
                startIndex,
                leaves: [leaf],
                startSubtrees: treeSnapshots[startIndex]
            }).filledSubtrees)
    );
    console.log(treeSnapshots);
})();
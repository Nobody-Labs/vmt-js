const { toFE, calculateZeros } = require('./utils');

module.exports = function calculateNextRoot({
    hasher,
    levels = 20,
    startIndex = 0,
    leaves = [],
    startSubtrees
}) {
    const zeros = calculateZeros({ hasher, levels }).map(toFE);
    if (typeof startSubtrees === 'undefined') {
        var filledSubtrees = zeros.slice(0, levels);
    } else {
        filledSubtrees = startSubtrees.map(toFE);
    }

    var currentLevelHash;
    leaves.forEach((leaf, l) => {
        let currentIndex = l + Number(startIndex);
        currentLevelHash = toFE(leaf);
        let left, right;

        for (let i = 0; i < levels; i++) {
            if (Math.floor(currentIndex % 2) == 0) {
                left = currentLevelHash;
                right = zeros[i];
                filledSubtrees[i] = currentLevelHash;
            } else {
                left = filledSubtrees[i];
                right = currentLevelHash;
            };
            currentLevelHash = hasher([left, right]);
            currentIndex = Math.floor(currentIndex / 2);
        };
    });

    return { root: currentLevelHash, filledSubtrees };
};
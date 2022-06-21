// source: https://github.com/iden3/circomlib/blob/v0.5.5/src/mimcsponge.js
const { BigNumber } = require('@ethersproject/bignumber');
const { hexZeroPad } = require('@ethersproject/bytes');
const { keccak256 } = require('@ethersproject/keccak256');
const { F } = require('./utils');

const SEED = "mimcsponge";
const NROUNDS = 220;

function getConstants(seed, nRounds) {
    if (typeof seed === "undefined") seed = SEED;
    if (typeof nRounds === "undefined") nRounds = NROUNDS;
    const cts = new Array(nRounds);
    let c = keccak256(Buffer.from(seed));
    for (let i=1; i<nRounds; i++) {
        c = keccak256(c);

        const n1 = BigNumber.from(c).mod(BigNumber.from(F.p.toString()));
        const c2 = hexZeroPad(n1.toHexString(), 64);
        cts[i] = F.e(BigNumber.from(c2).toString());
    }
    cts[0] = F.e(0);
    cts[cts.length - 1] = F.e(0);
    return cts;
};

const cts = getConstants(SEED, NROUNDS);

function mimcHash(_xL_in, _xR_in, _k) {
    let xL = F.e(_xL_in);
    let xR = F.e(_xR_in);
    const k = F.e(_k);
    for (let i=0; i<NROUNDS; i++) {
        const c = cts[i];
        const t = (i==0) ? F.add(xL, k) : F.add(F.add(xL, k), c);
        const xR_tmp = F.e(xR);
        if (i < (NROUNDS - 1)) {
            xR = xL;
            xL = F.add(xR_tmp, F.pow(t, 5));
        } else {
            xR = F.add(xR_tmp, F.pow(t, 5));
        }
    }
    return {
        xL: F.normalize(xL),
        xR: F.normalize(xR),
    };
};

module.exports = function mimcSponge(arr) {
    let R = F.zero;
    let C = F.zero;

    for (let i=0; i<arr.length; i++) {
        R = F.add(R, F.e(arr[i]));
        const S = mimcHash(R, C, F.zero);
        R = S.xL;
        C = S.xR;
    }

    return F.normalize(R);
};
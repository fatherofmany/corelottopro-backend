"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = getProvider;
exports.getSigner = getSigner;
exports.getContract = getContract;
const ethers_1 = require("ethers");
const rpc = process.env.CORE_RPC_URL;
const chainId = Number(process.env.CHAIN_ID || 1114);
const contractAddress = process.env.CONTRACT_ADDRESS;
let provider = null;
let signer = null;
function getProvider() {
    if (!provider) {
        if (!rpc)
            throw new Error('CORE_RPC_URL not set');
        provider = new ethers_1.ethers.JsonRpcProvider(rpc, chainId);
    }
    return provider;
}
function getSigner() {
    const pk = process.env.ADMIN_PRIVATE_KEY;
    if (!pk)
        return null;
    if (!signer)
        signer = new ethers_1.ethers.Wallet(pk, getProvider());
    return signer;
}
function getContract(abi) {
    if (!contractAddress)
        throw new Error('CONTRACT_ADDRESS not set');
    return new ethers_1.ethers.Contract(contractAddress, abi, getProvider());
}

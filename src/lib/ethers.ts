import { ethers } from 'ethers';

const rpc = process.env.CORE_RPC_URL;
const chainId = Number(process.env.CHAIN_ID || 1114);
const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

let provider: ethers.JsonRpcProvider | null = null;
let signer: ethers.Wallet | null = null;

export function getProvider() {
  if (!provider) {
    if (!rpc) throw new Error('CORE_RPC_URL not set');
    provider = new ethers.JsonRpcProvider(rpc, chainId);
  }
  return provider;
}

export function getSigner() {
  const pk = process.env.ADMIN_PRIVATE_KEY;
  if (!pk) return null;
  if (!signer) signer = new ethers.Wallet(pk, getProvider());
  return signer;
}

export function getContract(abi: any) {
  if (!contractAddress) throw new Error('CONTRACT_ADDRESS not set');
  return new ethers.Contract(contractAddress, abi, getProvider());
}
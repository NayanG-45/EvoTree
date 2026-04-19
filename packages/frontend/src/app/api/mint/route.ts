import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import EvoTreeABI from '@/contracts/EvoTreeEcosystem.json'; // The ABI we copied

// The address you just deployed!
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Hardhat Account #0 Private Key (Our trusted ISSUER)
const ADMIN_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export async function POST(req: Request) {
  try {
    const { userWalletAddress, tokenId } = await req.json();

    if (!userWalletAddress || tokenId === undefined) {
      return NextResponse.json({ error: 'Missing wallet address or token ID' }, { status: 400 });
    }

    // 1. Setup the Admin Wallet Client
    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: hardhat,
      transport: http('http://127.0.0.1:8545') // Connecting to your local node terminal
    }).extend(publicActions);

    // 2. Simulate & Execute the Mint Transaction
    const { request } = await client.simulateContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: EvoTreeABI.abi,
      functionName: 'mintNode',
      args: [userWalletAddress, BigInt(tokenId), BigInt(1)],
    });

    const hash = await client.writeContract(request);
    
    // Wait for the blockchain to mine it
    await client.waitForTransactionReceipt({ hash });

    return NextResponse.json({ 
      success: true, 
      message: `Token ${tokenId} minted successfully!`,
      txHash: hash 
    });

  } catch (error: any) {
    console.error('Minting Error:', error);
    return NextResponse.json({ error: error.shortMessage || 'Failed to mint token' }, { status: 500 });
  }
}
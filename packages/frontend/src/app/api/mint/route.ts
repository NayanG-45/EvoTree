import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import EvoTreeABI from '@/contracts/EvoTreeEcosystem.json'; // The ABI we copied

// The address you just deployed!
const CONTRACT_ADDRESS = '0x54b30187AfA10b03B9b2d6FfFC7b38EcD4Ce696b';

// Sepolia Admin Key — set ADMIN_PRIVATE_KEY in .env.local for production!
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

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
      chain: sepolia,
      transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
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

  } catch (error) {
    console.error('Minting Error:', error);
    interface MintError extends Error { shortMessage?: string }
    const errorMessage = error instanceof Error ? (error as MintError).shortMessage || error.message : 'Failed to mint token';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
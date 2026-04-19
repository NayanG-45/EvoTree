import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import EvoTreeABI from '@/contracts/EvoTreeEcosystem.json'; // The ABI we copied

// The EVM address of the EvoTree contract
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x54b30187AfA10b03B9b2d6FfFC7b38EcD4Ce696b';

// Private key for the admin/issuer wallet
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

export async function POST(req: Request) {
  try {
    const { userWalletAddress, tokenId } = await req.json();

    if (!userWalletAddress || tokenId === undefined) {
      return NextResponse.json({ error: 'Missing wallet address or token ID' }, { status: 400 });
    }

    // 1. Setup the Admin Wallet Client
    if (!ADMIN_PRIVATE_KEY) {
      console.error("ADMIN_PRIVATE_KEY is not defined in environment variables.");
      return NextResponse.json({ error: 'Server configuration error: Admin key missing' }, { status: 500 });
    }

    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY as `0x${string}`);
    const rpcUrl = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
    
    const client = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl),
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
    console.error('Full Minting Error Details:', error);
    
    // Extract the most readable error message
    let errorMessage = 'Failed to mint token';
    if (error.shortMessage) {
      errorMessage = error.shortMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error.reason || null 
    }, { status: 500 });
  }
}
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { getContract, getContractWithSigner, TOKEN_ID, getTransactionUrl } from '@/lib/web3';

export interface ContractState {
  userBalance: number;
  isLoading: boolean;
  isMinting: boolean;
  error: string | null;
}

export function useContract(provider: ethers.BrowserProvider | null, address: string | null) {
  const [state, setState] = useState<ContractState>({
    userBalance: 0,
    isLoading: false,
    isMinting: false,
    error: null,
  });

  const { toast } = useToast();



  const fetchUserBalance = useCallback(async () => {
    if (!provider || !address) {
      // Reset balance when no provider or address
      setState(prev => ({ ...prev, userBalance: 0 }));
      return;
    }

    try {
      const contract = await getContract(provider);
      const balance = await contract.balanceOf(address, TOKEN_ID);
      setState(prev => ({ ...prev, userBalance: Number(balance) }));
    } catch (error: any) {
      console.error('Error fetching user balance:', error);
      setState(prev => ({ 
        ...prev, 
        userBalance: 0,
        error: 'Failed to fetch user balance'
      }));
    }
  }, [provider, address]);

  const mintNFT = useCallback(async () => {
    if (!provider || !address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isMinting: true, error: null }));

    try {
      const contract = await getContractWithSigner(provider);

      // Check if user already owns the NFT
      const userBalance = await contract.balanceOf(address, TOKEN_ID);
      if (Number(userBalance) > 0) {
        throw new Error('You have already minted your Poppie NFT (1 per wallet limit)');
      }

      // Try the simpler claim function first
      const tx = await contract.claim(
        address, // _receiver
        TOKEN_ID, // _tokenId
        1, // _quantity
        '0x0000000000000000000000000000000000000000', // _currency (native token)
        0, // _pricePerToken (free mint)
        [], // _proofs (public mint)
        { value: 0 } // No payment for free mint
      );

      toast({
        title: 'Transaction Submitted',
        description: (
          <div>
            <p>Your minting transaction has been submitted.</p>
            <a 
              href={getTransactionUrl(tx.hash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View on Monad Explorer →
            </a>
          </div>
        ),
      });

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast({
          title: 'Mint Successful! 🎉',
          description: (
            <div>
              <p>Your Poppie NFT has been minted successfully!</p>
              <a 
                href={getTransactionUrl(receipt.hash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View Transaction →
              </a>
            </div>
          ),
        });

        // Refresh user balance
        await fetchUserBalance();
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Error minting NFT:', error);
      
      let errorMessage = 'Failed to mint NFT';
      if (error.message.includes('already minted')) {
        errorMessage = error.message;
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient MON tokens for gas fees';
      } else if (error.message.includes('phase not active')) {
        errorMessage = 'Minting phase is not currently active';
      } else if (error.message.includes('execution reverted')) {
        errorMessage = 'Contract execution failed. The minting phase may not be active or you may have already minted.';
      }

      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: 'Minting Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, isMinting: false }));
    }
  }, [provider, address, toast, fetchUserBalance]);



  // Fetch user balance when address changes
  useEffect(() => {
    if (provider && address) {
      fetchUserBalance();
    }
  }, [fetchUserBalance, provider, address]);

  return {
    ...state,
    mintNFT,
    fetchUserBalance,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, TOKEN_ID, MONAD_TESTNET_CONFIG } from '@/lib/web3';

export function useSupply() {
  const [currentSupply, setCurrentSupply] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupply = useCallback(async () => {
    try {
      setError(null);
      
      // Create a provider directly to Monad testnet
      const provider = new ethers.JsonRpcProvider(MONAD_TESTNET_CONFIG.rpcUrls[0]);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const supply = await contract.totalSupply(TOKEN_ID);
      setCurrentSupply(Number(supply));
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching supply:', error);
      setError('Failed to fetch current supply');
      setIsLoading(false);
    }
  }, []);

  // Fetch supply every 2.5 seconds
  useEffect(() => {
    // Initial fetch
    fetchSupply();

    const interval = setInterval(fetchSupply, 2500);
    return () => clearInterval(interval);
  }, [fetchSupply]);

  return {
    currentSupply,
    isLoading,
    error,
    fetchSupply,
  };
}
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { 
  detectWallets, 
  switchToMonadTestnet, 
  MONAD_TESTNET_CONFIG,
  type EIP6963ProviderDetail 
} from '@/lib/web3';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  availableWallets: EIP6963ProviderDetail[];
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    availableWallets: [],
    isConnecting: false,
    error: null,
  });

  const { toast } = useToast();

  const detectAvailableWallets = useCallback(async () => {
    try {
      const wallets = await detectWallets();
      setState(prev => ({ ...prev, availableWallets: wallets }));
    } catch (error) {
      console.error('Error detecting wallets:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to detect available wallets' 
      }));
    }
  }, []);

  const connectWallet = useCallback(async (walletDetail: EIP6963ProviderDetail) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const browserProvider = new ethers.BrowserProvider(walletDetail.provider);
      
      // Request account access
      const accounts = await walletDetail.provider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      // Check if we're on the correct network
      const chainId = await walletDetail.provider.request({ method: 'eth_chainId' });
      const currentChainId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
      if (currentChainId !== MONAD_TESTNET_CONFIG.chainId) {
        await switchToMonadTestnet(walletDetail.provider);
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        address: accounts[0],
        provider: browserProvider,
        isConnecting: false,
      }));

      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletDetail.info.name}`,
      });

      // Listen for account changes
      walletDetail.provider.on?.('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setState(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      // Listen for chain changes
      walletDetail.provider.on?.('chainChanged', (chainId: string) => {
        const currentChainId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
        if (currentChainId !== MONAD_TESTNET_CONFIG.chainId) {
          toast({
            title: 'Wrong Network',
            description: 'Please switch back to Monad Testnet',
            variant: 'destructive',
          });
        }
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      }));
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      provider: null,
      availableWallets: state.availableWallets,
      isConnecting: false,
      error: null,
    });
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [state.availableWallets, toast]);

  // Detect wallets on mount
  useEffect(() => {
    detectAvailableWallets();
  }, [detectAvailableWallets]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            setState(prev => ({
              ...prev,
              isConnected: true,
              address: accounts[0],
              provider: browserProvider,
            }));
          }
        } catch (error) {
          console.error('Error checking existing connection:', error);
        }
      }
    };

    checkExistingConnection();
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    detectAvailableWallets,
  };
}

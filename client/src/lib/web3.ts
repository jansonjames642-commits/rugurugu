import { ethers } from 'ethers';

// Type declarations for Web3
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

declare module 'ethers' {
  interface Eip1193Provider {
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  }
}

export const MONAD_TESTNET_CONFIG = {
  chainId: 10143,
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

export const CONTRACT_ADDRESS = '0x0337a3f0a53d83a78F5137b421a57583DECA4b0B';
export const TOKEN_ID = 0;
export const MAX_SUPPLY = 6900;

// thirdweb Edition Drop ABI - minimal required functions
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_quantity', type: 'uint256' },
      { internalType: 'address', name: '_currency', type: 'address' },
      { internalType: 'uint256', name: '_pricePerToken', type: 'uint256' },
      { internalType: 'bytes32[]', name: '_proofs', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_quantity', type: 'uint256' },
      { internalType: 'address', name: '_currency', type: 'address' },
      { internalType: 'uint256', name: '_pricePerToken', type: 'uint256' },
      {
        components: [
          { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
          { internalType: 'uint256', name: 'quantityLimitPerWallet', type: 'uint256' },
          { internalType: 'uint256', name: 'pricePerToken', type: 'uint256' },
          { internalType: 'address', name: 'currency', type: 'address' },
        ],
        internalType: 'struct IDrop.AllowlistProof',
        name: '_allowlistProof',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: ethers.Eip1193Provider;
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider';
  detail: EIP6963ProviderDetail;
}

declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': EIP6963AnnounceProviderEvent;
  }
}

export function detectWallets(): Promise<EIP6963ProviderDetail[]> {
  return new Promise((resolve) => {
    const providers: EIP6963ProviderDetail[] = [];

    // Add MetaMask if available
    if (typeof window !== 'undefined' && window.ethereum) {
      providers.push({
        info: {
          uuid: 'metamask',
          name: 'MetaMask',
          icon: '🦊',
          rdns: 'io.metamask',
        },
        provider: window.ethereum,
      });
    }

    // Listen for EIP-6963 announcements
    const handleAnnouncement = (event: EIP6963AnnounceProviderEvent) => {
      providers.push(event.detail);
    };

    window.addEventListener('eip6963:announceProvider', handleAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Resolve after a short delay to collect announcements
    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', handleAnnouncement);
      resolve(providers);
    }, 100);
  });
}

export async function switchToMonadTestnet(provider: ethers.Eip1193Provider): Promise<void> {
  const chainIdHex = `0x${MONAD_TESTNET_CONFIG.chainId.toString(16)}`;
  
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    // Chain not added to wallet
    if (switchError.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          ...MONAD_TESTNET_CONFIG,
          chainId: chainIdHex,
        }],
      });
    } else {
      throw switchError;
    }
  }
}

export async function getContract(provider: ethers.BrowserProvider): Promise<ethers.Contract> {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export async function getContractWithSigner(provider: ethers.BrowserProvider): Promise<ethers.Contract> {
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatSupply(current: number, max: number = MAX_SUPPLY): string {
  return `${current.toLocaleString()} / ${max.toLocaleString()}`;
}

export function getTransactionUrl(txHash: string): string {
  return `${MONAD_TESTNET_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
}

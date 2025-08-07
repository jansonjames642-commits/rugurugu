import { Button } from '@/components/ui/button';
import { type EIP6963ProviderDetail } from '@/lib/web3';

interface WalletConnectionProps {
  availableWallets: EIP6963ProviderDetail[];
  isConnecting: boolean;
  onConnect: (wallet: EIP6963ProviderDetail) => void;
}

export function WalletConnection({ availableWallets, isConnecting, onConnect }: WalletConnectionProps) {
  if (availableWallets.length === 0) {
    return (
      <div className="space-y-6" data-testid="wallet-connection">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Connect Wallet</h3>
          <p className="text-purple-200 text-sm">No Web3 wallet detected</p>
        </div>

        <div className="text-center text-purple-200 p-6 bg-purple-900/20 rounded-xl border border-purple-700/30" data-testid="no-wallet-detected">
          <div className="text-3xl mb-4 text-yellow-400">⚠️</div>
          <p className="mb-4">No Web3 wallet detected</p>
          <p className="text-sm mb-4">Please install MetaMask or another Web3 wallet to continue</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-purple-300 hover:text-white transition-colors"
            data-testid="link-download-metamask"
          >
            Download MetaMask →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="wallet-connection">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Connect Wallet</h3>
        <p className="text-purple-200 text-sm">Choose your preferred wallet to continue</p>
      </div>

      <div className="space-y-3">
        {availableWallets.map((wallet, index) => (
          <Button
            key={`${wallet.info.uuid}-${index}`}
            onClick={() => onConnect(wallet)}
            disabled={isConnecting}
            className="w-full bg-purple-600/20 hover:bg-purple-600/30 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`button-connect-${wallet.info.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {wallet.info.icon || (wallet.info.name.includes('MetaMask') ? '🦊' : '🔗')}
            </span>
            <span>{isConnecting ? 'Connecting...' : wallet.info.name}</span>
            <span className="ml-auto group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

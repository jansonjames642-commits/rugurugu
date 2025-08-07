import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/web3';

interface MintingInterfaceProps {
  address: string;
  userBalance: number;
  isMinting: boolean;
  onMint: () => void;
  onDisconnect: () => void;
}

export function MintingInterface({ 
  address, 
  userBalance, 
  isMinting, 
  onMint, 
  onDisconnect 
}: MintingInterfaceProps) {
  const hasAlreadyMinted = userBalance > 0;

  return (
    <div className="space-y-6" data-testid="minting-interface">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Wallet Connected</h3>
        <div className="bg-black/30 rounded-xl p-3 border border-white/10">
          <p className="text-purple-200 text-xs mb-1">Connected Account</p>
          <p className="text-white font-mono text-sm" data-testid="text-connected-address">
            {formatAddress(address)}
          </p>
        </div>
      </div>

      {isMinting ? (
        <div className="text-center py-8" data-testid="minting-state">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
            <span className="text-white text-2xl">⚙️</span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Minting in progress...</h4>
          <p className="text-purple-200 text-sm">Please confirm the transaction in your wallet</p>
        </div>
      ) : hasAlreadyMinted ? (
        <div className="text-center py-8" data-testid="already-minted-state">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <span className="text-white text-3xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Already Minted!</h3>
          <p className="text-purple-200 mb-6">You have already minted your Poppie NFT</p>
          <div className="space-y-3">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              onClick={() => window.open('https://testnet.monadexplorer.com', '_blank')}
              data-testid="button-view-explorer"
            >
              View on Explorer
            </Button>
            <Button 
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-white/20"
              onClick={onDisconnect}
              data-testid="button-disconnect"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            onClick={onMint}
            disabled={isMinting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group"
            data-testid="button-mint-nft"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-xl">✨</span>
              <span className="text-lg">Mint Your Poppie</span>
            </div>
          </Button>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/10" data-testid="mint-info-price">
              <p className="text-purple-200 mb-1">Price</p>
              <p className="text-white font-semibold">FREE</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/10" data-testid="mint-info-limit">
              <p className="text-purple-200 mb-1">Limit</p>
              <p className="text-white font-semibold">1 per wallet</p>
            </div>
          </div>

          <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30" data-testid="network-info">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium text-sm">Monad Testnet</p>
                <p className="text-purple-200 text-xs">Chain ID: 10143</p>
              </div>
              <div className="ml-auto">
                <a 
                  href="https://testnet.monadexplorer.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-white transition-colors"
                  data-testid="link-explorer"
                >
                  →
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

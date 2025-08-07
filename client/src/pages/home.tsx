import { useWallet } from '@/hooks/use-wallet';
import { useContract } from '@/hooks/use-contract';
import { useSupply } from '@/hooks/use-supply';
import { SupplyCounter } from '@/components/supply-counter';
import { WalletConnection } from '@/components/wallet-connection';
import { MintingInterface } from '@/components/minting-interface';

export default function Home() {
  const {
    isConnected,
    address,
    provider,
    availableWallets,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const { currentSupply, isLoading: supplyLoading } = useSupply();

  const {
    userBalance,
    isMinting,
    mintNFT,
  } = useContract(provider, address);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), 
              radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)
            `
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3" data-testid="header-brand">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🌸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Poppies Rug</h1>
              <p className="text-purple-200 text-sm">NFT Collection</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="https://x.com/monad_xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors duration-200"
              data-testid="link-monad-twitter"
            >
              🐦 @monad_xyz
            </a>
            <a 
              href="https://x.com/berzanorg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors duration-200"
              data-testid="link-berzan-twitter"
            >
              🐦 @berzanorg
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
            Mint Your{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Poppie
            </span>
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
            Just a Rug. A limited collection of 6,900 unique NFTs on Monad Testnet. 
            Free to mint, one per wallet.
          </p>
          
          {/* Supply Counter */}
          <SupplyCounter 
            currentSupply={currentSupply} 
            isLoading={supplyLoading}
          />
        </div>

        {/* Minting Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden" data-testid="minting-card">
            
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              {!isConnected ? (
                <WalletConnection
                  availableWallets={availableWallets}
                  isConnecting={isConnecting}
                  onConnect={connectWallet}
                />
              ) : (
                <MintingInterface
                  address={address!}
                  userBalance={userBalance}
                  isMinting={isMinting}
                  onMint={mintNFT}
                  onDisconnect={disconnectWallet}
                />
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a 
                href="https://x.com/monad_xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                data-testid="footer-link-monad"
              >
                <span>🐦</span>
                <span>Follow @monad_xyz</span>
              </a>
              <span className="text-purple-400">•</span>
              <a 
                href="https://x.com/berzanorg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                data-testid="footer-link-berzan"
              >
                <span>🐦</span>
                <span>Follow @berzanorg</span>
              </a>
            </div>
            
            <div className="text-purple-300 text-sm" data-testid="footer-copyright">
              <p>© 2025 Poppies Rug. Just a Rug.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

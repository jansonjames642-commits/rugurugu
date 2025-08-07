import { formatSupply } from '@/lib/web3';

interface SupplyCounterProps {
  currentSupply: number;
  maxSupply?: number;
  isLoading?: boolean;
}

export function SupplyCounter({ currentSupply, maxSupply = 6900, isLoading }: SupplyCounterProps) {
  const displaySupply = currentSupply ?? 0;
  
  return (
    <div className="inline-flex items-center bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10" data-testid="supply-counter">
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-mono font-bold text-yellow-300 mb-2" data-testid="supply-numbers">
          {isLoading ? (
            <div className="animate-pulse">
              <span className="bg-yellow-300/20 rounded px-2">---</span>
              <span className="text-white/50"> / {maxSupply.toLocaleString()}</span>
            </div>
          ) : (
            <>
              <span>{displaySupply.toLocaleString()}</span>
              <span className="text-white/50"> / {maxSupply.toLocaleString()}</span>
            </>
          )}
        </div>
        <p className="text-purple-200 text-sm uppercase tracking-wide" data-testid="supply-label">
          Minted
        </p>
      </div>
    </div>
  );
}

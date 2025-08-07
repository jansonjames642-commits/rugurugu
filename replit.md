# Overview

This is a React-based NFT minting application for the "Poppies Rug" collection on Monad Testnet. The application provides a modern web interface for users to connect their Web3 wallets and mint NFTs from a specific thirdweb Edition Drop contract. Built with TypeScript, React, and styled with Tailwind CSS using shadcn/ui components, the application features wallet detection via EIP-6963, real-time supply tracking, and a responsive gradient design with animated elements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript in a Vite-powered single-page application
- **Routing**: Client-side routing using Wouter for lightweight navigation
- **State Management**: React hooks with custom useWallet and useContract hooks for Web3 interactions
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support

**Component Structure**:
- Modular component architecture with separation of concerns
- Custom hooks for wallet connection and smart contract interactions
- Reusable UI components for minting interface, wallet connection, and supply tracking

## Backend Architecture

**Server**: Express.js server with TypeScript
- **Development**: Vite integration for hot module replacement and development server
- **API Structure**: RESTful API routes with `/api` prefix
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Storage**: In-memory storage implementation with interface for future database integration

**Build Process**:
- Client builds to `dist/public` directory
- Server bundles with esbuild for production deployment
- Environment-based configuration for development vs production

## Data Storage

**Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL instance
- **Migrations**: Schema versioning with Drizzle Kit
- **Models**: User authentication schema with UUID primary keys

**Web3 Data**:
- Real-time contract state fetching (supply, user balances)
- Local state management for wallet connection status
- No persistent storage of blockchain data (fetched on demand)

## Authentication & Authorization

**Web3 Wallet Authentication**:
- EIP-6963 wallet detection standard for discovering available wallets
- Ethers.js v6 for blockchain interactions
- MetaMask and other Web3 wallet support
- Network switching to Monad Testnet (Chain ID: 10143)

**Session Management**:
- Wallet connection state managed in React context
- No traditional user sessions (wallet-based authentication only)

# External Dependencies

## Blockchain Infrastructure

**Network**: Monad Testnet
- **RPC**: `https://testnet-rpc.monad.xyz`
- **Explorer**: `https://testnet.monadexplorer.com`
- **Native Currency**: MON token

**Smart Contract**: thirdweb Edition Drop contract
- **Address**: `0x0337a3f0a53d83a78F5137b421a57583DECA4b0B`
- **Standard**: ERC-1155 multi-token contract
- **Functions**: `claim()` for minting, `totalSupply()` and `balanceOf()` for querying

## Third-Party Services

**Database**: Neon Database (serverless PostgreSQL)
- Connection via DATABASE_URL environment variable
- Managed PostgreSQL with connection pooling

**Development Tools**:
- Replit integration for development environment
- Vite development server with HMR
- TypeScript compilation and type checking

## Key Libraries

**Frontend**:
- React Query (@tanstack/react-query) for server state management
- Ethers.js for Web3 blockchain interactions
- Radix UI primitives for accessible component foundations
- Tailwind CSS for utility-first styling
- React Hook Form with Zod for form validation

**Backend**:
- Express.js for HTTP server
- Drizzle ORM for database operations
- tsx for TypeScript execution in development
- esbuild for production bundling

**UI/UX**:
- shadcn/ui component library
- Class Variance Authority for component variants
- Lucide React for consistent iconography
- Custom animations and gradient backgrounds
# SparkMint - Solana Token Creator

A modern, comprehensive frontend application that integrates with the Solana blockchain to create, mint, and manage SPL tokens. Built with Next.js, Clerk authentication, and Solana wallet integration.

## 🚀 Features

### Authentication & Security

- **Clerk Authentication**: Secure user authentication with multiple sign-in methods
- **Wallet Integration**: Seamless connection with Phantom, Solflare, and other Solana wallets
- **Protected Routes**: Dashboard access only for authenticated users

### Solana Blockchain Integration

- **Token Creation**: Create custom SPL tokens with metadata and supply controls
- **Token Minting**: Mint additional tokens to any address (requires mint authority)
- **Token Transfers**: Send tokens between wallets with real-time validation
- **Wallet Balance**: View SOL and token balances with refresh functionality
- **Transaction History**: Comprehensive transaction history with filtering and pagination

### User Experience

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Live balance updates and transaction status
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading indicators for all operations
- **Mobile Responsive**: Optimized for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Blockchain**: Solana Web3.js, SPL Token Library
- **Wallet Adapters**: Phantom, Solflare wallet adapters
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradients

## 🏗️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Clerk account (free at [clerk.com](https://clerk.com))
- A Solana wallet (Phantom or Solflare recommended)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Create a `.env.local` file in the root directory:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### 3. Configure Clerk Settings

In your Clerk dashboard:

1. **Sign-in methods**: Enable email, phone, or social providers as needed
2. **Redirect URLs**: Set these in your Clerk dashboard:
   - Sign-in redirect: `http://localhost:3000/dashboard`
   - Sign-up redirect: `http://localhost:3000/dashboard`
   - After sign-out: `http://localhost:3000`

### 4. Get Devnet SOL

Before testing, you'll need some Devnet SOL for transaction fees:

1. Connect your wallet to the application
2. Visit [Solana Faucet](https://faucet.solana.com/)
3. Enter your wallet address and request SOL
4. Switch your wallet to Devnet

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

### 1. Landing Page

- Beautiful landing page with feature overview
- Sign up or sign in with Clerk authentication
- Automatic redirect to dashboard after authentication

### 2. Dashboard Overview

- Connect your Solana wallet (Phantom/Solflare)
- View SOL and token balances
- Quick action buttons for all features
- Recent transaction history

### 3. Create Tokens

- **Name & Symbol**: Define your token identity
- **Decimals**: Set precision (0-18 decimal places)
- **Initial Supply**: Mint tokens to your wallet on creation
- **Description**: Optional token description

### 4. Mint Tokens

- **Mint Address**: Address of the token to mint
- **Recipient**: Wallet address to receive tokens
- **Amount**: Number of tokens to mint
- **Authority Check**: Verify you're the mint authority

### 5. Send Tokens

- **Token Selection**: Choose from your available tokens
- **Recipient**: Enter destination wallet address
- **Amount**: Specify transfer amount with MAX button
- **Balance Validation**: Prevents overdraft attempts

### 6. Transaction History

- **Real-time Updates**: Latest transactions automatically loaded
- **Detailed Information**: Transaction type, amount, fees, timestamps
- **Explorer Links**: Direct links to Solana Explorer
- **Pagination**: Load more transactions as needed

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── components/           # Reusable components
│   │   ├── SolanaWalletProvider.js
│   │   ├── WalletConnection.js
│   │   ├── WalletBalance.js
│   │   ├── TokenCreator.js
│   │   ├── TokenMinter.js
│   │   ├── TokenSender.js
│   │   └── TransactionHistory.js
│   ├── dashboard/           # Dashboard pages
│   │   └── page.js
│   ├── globals.css          # Global styles
│   ├── layout.js           # Root layout with Clerk provider
│   └── page.js             # Landing page
```

### Key Components

- **SolanaWalletProvider**: Wraps app with Solana wallet adapters
- **WalletConnection**: Handles wallet connect/disconnect UI
- **WalletBalance**: Displays SOL and token balances
- **TokenCreator**: Form for creating new SPL tokens
- **TokenMinter**: Interface for minting existing tokens
- **TokenSender**: Token transfer functionality
- **TransactionHistory**: Transaction list with pagination

### Environment Variables

All environment variables are optional in development, but Clerk keys are required for authentication:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key (required)
- `CLERK_SECRET_KEY`: Clerk secret key (required)
- `NEXT_PUBLIC_SOLANA_NETWORK`: Solana network (defaults to devnet)
- `NEXT_PUBLIC_RPC_ENDPOINT`: RPC endpoint (defaults to devnet)

## 🚦 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

   - Ensure your wallet is on Devnet
   - Try refreshing the page
   - Check wallet extension is unlocked

2. **Transaction Failures**

   - Ensure sufficient SOL for fees (minimum 0.001 SOL)
   - Verify wallet is connected
   - Check network connectivity

3. **Token Creation Issues**

   - Ensure unique token symbol
   - Verify sufficient SOL balance
   - Check all required fields are filled

4. **Minting Issues**
   - Verify you're the mint authority
   - Check token mint address is valid
   - Ensure recipient address is valid

## 🔒 Security Features

- **Client-side Validation**: All inputs validated before blockchain interaction
- **Wallet Integration**: Secure wallet communication through standard adapters
- **Error Handling**: Comprehensive error catching and user feedback
- **Protected Routes**: Authentication required for sensitive operations
- **Transaction Verification**: Real-time transaction status checking

## 🌐 Network Support

Currently supports Solana Devnet for development and testing. Production deployment can be configured for Mainnet by updating the environment variables.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This application uses Solana Devnet by default. Always test thoroughly before using on Mainnet with real SOL.

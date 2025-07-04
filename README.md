# SparkMint 🪙

A next-generation token creation platform that simplifies cryptocurrency token development on the Solana blockchain.

![SparkMint Banner](https://via.placeholder.com/800x200/1e40af/ffffff?text=SparkMint+-+Token+Creation+Platform)

## 🚀 About SparkMint

**SparkMint** is a user-friendly web application that allows anyone to create and manage custom cryptocurrency tokens on the Solana blockchain without technical expertise. The platform features an intuitive dashboard where users can connect their wallets, deploy real tokens with customizable properties, and track their transactions in real-time. Built with modern web technologies, it bridges the gap between complex blockchain operations and everyday users, making token creation as simple as filling out a form.

## ✨ Features

### 🎯 Core Functionality

- **Easy Token Creation** - Deploy custom tokens with name, symbol, decimals, and initial supply
- **Wallet Integration** - Seamless connection with Phantom and Solflare wallets
- **Token Minting** - Mint additional tokens to any address
- **Token Transfers** - Send tokens between addresses with ease
- **Real-time Balance** - Live SOL and token balance tracking

### 🎨 User Experience

- **Beautiful Landing Page** - Animated hero section with smooth transitions
- **Responsive Dashboard** - Modern, clean interface that works on all devices
- **Transaction History** - Complete record of all blockchain transactions
- **Interactive Animations** - Engaging visual effects and micro-interactions

### 🔒 Security & Reliability

- **Blockchain Integration** - Real transactions on Solana Devnet
- **Secure Authentication** - Clerk-powered user management
- **Wallet Security** - Non-custodial wallet connections
- **Transaction Verification** - All operations verified on-chain

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: Clerk
- **Blockchain**: Solana Web3.js, SPL Token
- **Wallet Adapters**: Phantom, Solflare
- **Styling**: Tailwind CSS, Custom animations
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sparkmint.git
   cd sparkmint
   ```

2. **Install dependencies**

```bash
npm install
   # or
   yarn install
```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
```

4. **Run the development server**

```bash
npm run dev
   # or
   yarn dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Getting Started

1. **Sign Up/Sign In** - Create an account or sign in with Clerk authentication
2. **Connect Wallet** - Connect your Phantom or Solflare wallet
3. **Fund Wallet** - Ensure you have some SOL on Solana Devnet for transaction fees

### Creating Tokens

1. Navigate to **Create Token** section
2. Fill in token details:
   - Token Name (e.g., "My Amazing Token")
   - Token Symbol (e.g., "MAT")
   - Decimals (0-18, default: 9)
   - Initial Supply
   - Description (optional)
3. Click **Create Token on Blockchain**
4. Approve the transaction in your wallet
5. Your token will be deployed and appear in your balance

### Managing Tokens

- **Mint Tokens**: Increase supply of existing tokens
- **Send Tokens**: Transfer tokens to other addresses
- **View History**: Check all transaction records
- **Monitor Balance**: Real-time wallet balance updates

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Configuration

### Solana Network

The app is configured to use Solana Devnet by default. To change networks, update the configuration in `src/app/components/SolanaWalletProvider.js`:

```javascript
// For Mainnet
const network = WalletAdapterNetwork.Mainnet;

// For Devnet (default)
const network = WalletAdapterNetwork.Devnet;
```

### Supported Wallets

- Phantom Wallet
- Solflare Wallet

Additional wallets can be added in the wallet provider configuration.

## 📁 Project Structure

```
sparkmint/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── SolanaWalletProvider.js
│   │   │   ├── WalletConnection.js
│   │   │   ├── TokenCreator.js
│   │   │   ├── TokenMinter.js
│   │   │   ├── TokenSender.js
│   │   │   ├── WalletBalance.js
│   │   │   └── TransactionHistory.js
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── globals.css          # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Landing page
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - For the robust blockchain infrastructure
- [Clerk](https://clerk.dev/) - For seamless authentication
- [Next.js](https://nextjs.org/) - For the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful styling utilities

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@sparkmint.dev
- 💬 Discord: [Join our community](https://discord.gg/sparkmint)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/sparkmint/issues)

---

**Made with ❤️ by the SparkMint Team**

_Empowering everyone to participate in the token economy_

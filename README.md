# Ronin Wallet Debugger

A comprehensive debugging application for Ronin Wallet integration. This tool helps developers test and debug interactions with the Ronin Wallet browser extension using the EIP-6963 injected provider standard.

## Features

- **Wallet Connection**: Connect to the Ronin Wallet browser extension
- **Chain Switching**: Toggle between Ronin Mainnet and Saigon Testnet
- **Sign-In with Ronin**: Test SIWE (Sign-In with Ethereum) functionality
- **Detailed Logging**: All operations are logged with timestamps and full response data
- **Error Handling**: Comprehensive error handling and status reporting
- **Provider Detection**: Automatic detection of the Ronin Wallet extension
- **Account Management**: View all connected accounts
- **Debug UI**: Clean, intuitive interface for testing wallet functions

## Prerequisites

- Node.js 18.17 or later
- Ronin Wallet browser extension installed
- npm or yarn package manager

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   cd RoninDebugging
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Debugging Flow

1. **Connect Wallet**: The first step is to connect your Ronin Wallet to the application
2. **Test Chain Switching**: Once connected, test switching between Mainnet and Testnet
3. **Sign-In**: Test the SIWE functionality with message signing
4. **Check Logs**: Review the detailed logs for each operation
5. **Disconnect**: Test the disconnect functionality

## Dependencies

- Next.js 14
- @sky-mavis/tanto-connect
- siwe (Sign-In with Ethereum)
- ethers.js
- TypeScript
- TailwindCSS

## Important Notes

- This tool is for debugging purposes only and should not be used in production
- All operations are logged in the UI and to the browser console for easy debugging
- The application will detect if the Ronin Wallet extension is not installed and prompt for installation

## Resources

- [Ronin Wallet Documentation](https://wallet.roninchain.com)
- [EIP-6963 Standard](https://eips.ethereum.org/EIPS/eip-6963)
- [Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)

## License

MIT

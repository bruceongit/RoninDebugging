"use client";

import RoninWalletDebugger from './components/RoninWalletDebugger';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900">
      <header className="w-full bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Ronin Wallet Debugger</h1>
          <p className="text-blue-100">A debugging tool for Ronin Wallet integration</p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <p className="mb-2">
            This application provides a comprehensive debugging interface for Ronin Wallet integration.
            It allows developers to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
            <li>Connect to Ronin Wallet via EIP-6963 injected provider</li>
            <li>Switch between Ronin Mainnet and Saigon Testnet</li>
            <li>Sign in with Ronin (SIWE implementation)</li>
            <li>View detailed logs of all operations</li>
            <li>Debug connection issues and inspect wallet responses</li>
          </ul>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Note: You need to have Ronin Wallet browser extension installed to use this tool.
              If not installed, you'll be redirected to download it.
            </p>
          </div>
        </div>
        
        <RoninWalletDebugger />
      </main>
      
      <footer className="w-full bg-gray-100 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Ronin Wallet Debugger - Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  ChainIds,
  ConnectorError,
  ConnectorErrorType,
  requestRoninWalletConnector,
} from "@sky-mavis/tanto-connect";
import { SiweMessage } from "siwe";

interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "error";
  message: string;
  data?: any;
}

export default function RoninWalletDebugger() {
  // Core wallet state
  const [connector, setConnector] = useState<any>(null);
  const [connectedAddress, setConnectedAddress] = useState<string>();
  const [userAddresses, setUserAddresses] = useState<string[]>();
  const [currentChainId, setCurrentChainId] = useState<ChainIds | null>(null); // Update type here
  const [error, setError] = useState<string | null>(null);
  
  // SIWE state
  const [signature, setSignature] = useState<string>();
  
  // Debug logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Add a log entry
  const addLog = (type: "info" | "success" | "error", message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    setLogs(prevLogs => [
      { timestamp, type, message, data },
      ...prevLogs
    ]);
    
    // Also log to console for developer debugging
    if (type === "error") {
      console.error(`[${timestamp}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] ${message}`, data);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    addLog("info", "Logs cleared");
  };

  // Initialize connector
  useEffect(() => {
    addLog("info", "Initializing connector");
    getRoninWalletConnector().then((connector) => {
      if (connector) {
        setConnector(connector);
        addLog("success", "Connector initialized successfully", connector);
      } else {
        addLog("error", "Failed to initialize connector");
      }
    });
  }, []);

  // Get Ronin Wallet connector
  const getRoninWalletConnector = async () => {
    try {
      addLog("info", "Requesting Ronin wallet connector");
      const connector = await requestRoninWalletConnector();
      return connector;
    } catch (error) {
      if (error instanceof ConnectorError) {
        setError(error.name);
        addLog("error", `Connector error: ${error.name}`, error);
      } else {
        addLog("error", "Unknown error while requesting connector", error);
      }
      return null;
    }
  };

  // Connect to Ronin Wallet
  const connectRoninWallet = async () => {
    addLog("info", "Connecting to Ronin Wallet");
    
    if (!connector && error === ConnectorErrorType.PROVIDER_NOT_FOUND) {
      addLog("info", "Ronin Wallet not found, redirecting to download page");
      window.open("https://wallet.roninchain.com", "_blank");
      return;
    }

    try {
      addLog("info", "Requesting connection to Ronin Wallet");
      const connectResult = await connector?.connect();

      if (connectResult) {
        setConnectedAddress(connectResult.account);
        setCurrentChainId(connectResult.chainId);
        addLog("success", "Connected to Ronin Wallet", connectResult);
      } else {
        addLog("error", "Connection result was undefined");
      }

      addLog("info", "Getting user accounts");
      const accounts = await connector?.getAccounts();

      if (accounts && accounts.length > 0) {
        setUserAddresses(accounts);
        addLog("success", "Retrieved user accounts", accounts);
      } else {
        addLog("error", "No accounts found or accounts is undefined");
      }
    } catch (error) {
      addLog("error", "Error connecting to Ronin Wallet", error);
    }
  };

  // Switch chain
  const switchChain = async (chainId: ChainIds) => {
    try {
      addLog("info", `Switching chain to ${chainId}`);
      await connector?.switchChain(chainId);
      setCurrentChainId(chainId);
      addLog("success", `Switched chain to ${chainId}`);
    } catch (error) {
      addLog("error", "Error switching chain", error);
    }
  };

  // Sign in with Ronin
  const signInWithRonin = async () => {
    addLog("info", "Initiating Sign-In with Ronin");
    
    if (!connector) {
      addLog("error", "Connector not available");
      return;
    }

    try {
      addLog("info", "Requesting accounts");
      const accounts = await connector.requestAccounts();

      if (!accounts || accounts.length === 0) {
        addLog("error", "No accounts available");
        return;
      }

      const currentAccount = accounts[0];
      addLog("info", `Using account: ${currentAccount}`);

      // Create SIWE message
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      
      const nonce = Math.floor(Math.random() * 1000000).toString();
      addLog("info", `Generated nonce: ${nonce}`);

      const siweMessage = new SiweMessage({
        domain: window.location.hostname || "localhost",
        address: currentAccount,
        uri: window.location.origin || "http://localhost:3000",
        version: "1",
        chainId: currentChainId === ChainIds.RoninTestnet ? 2021 : 2020,
        nonce: nonce,
        statement: "I am signing in to debug Ronin Wallet integration",
        expirationTime: currentDate.toISOString(),
      });

      addLog("info", "Created SIWE message", siweMessage);

      const messageToSign = siweMessage.toMessage();
      addLog("info", "Message to sign", messageToSign);

      addLog("info", "Requesting signature");
      if (connector.getProvider) {
        const provider = await connector.getProvider();
        const sig = await provider.request({
          method: "personal_sign",
          params: [messageToSign, currentAccount],
        });

        setSignature(sig);
        addLog("success", "Signature received", sig);
      } else {
        addLog("error", "Connector does not have getProvider method");
      }
    } catch (error) {
      addLog("error", "Error during sign-in", error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setConnectedAddress(undefined);
    setUserAddresses(undefined);
    setCurrentChainId(null);
    setSignature(undefined);
    addLog("info", "Wallet disconnected manually");
  };

  // Format chain name for display
  const formatConnectedChain = (chainId: ChainIds | null) => {
    if (!chainId) return "Unknown Chain";
    
    switch (chainId) {
      case ChainIds.RoninMainnet:
        return `Ronin Mainnet - ${chainId}`;
      case ChainIds.RoninTestnet:
        return `Saigon Testnet - ${chainId}`;
      default:
        return `Unknown Chain - ${chainId}`;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ronin Wallet Debugger</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold">Wallet Connection</h2>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={connectRoninWallet}
                disabled={!!connectedAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
              >
                Connect Ronin Wallet
              </button>
              
              {connectedAddress && (
                <>
                  <button
                    onClick={() => switchChain(
                      currentChainId === ChainIds.RoninMainnet
                        ? ChainIds.RoninTestnet
                        : ChainIds.RoninMainnet
                    )}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    Switch Chain
                  </button>
                  
                  <button
                    onClick={signInWithRonin}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Sign In With Ronin
                  </button>
                  
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </div>
            
            {error === ConnectorErrorType.PROVIDER_NOT_FOUND && (
              <div className="text-red-600 font-semibold">
                Ronin Wallet not found. Please install it first.
              </div>
            )}
            
            {connectedAddress && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-sm">
                  <span className="font-semibold">Status:</span> Connected
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Current Chain:</span> {formatConnectedChain(currentChainId)}
                </div>
                <div className="text-sm break-all">
                  <span className="font-semibold">Current Address:</span> {connectedAddress}
                </div>
                {userAddresses && userAddresses.length > 0 && (
                  <div className="text-sm break-all">
                    <span className="font-semibold">All Addresses:</span> {userAddresses.join(', ')}
                  </div>
                )}
                {signature && (
                  <div className="text-sm break-all">
                    <span className="font-semibold">Signature:</span> 
                    <div className="bg-gray-100 p-2 rounded-md mt-1 text-xs font-mono overflow-x-auto">
                      {signature}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Debug Logs</h2>
              <button 
                onClick={clearLogs}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg"
              >
                Clear Logs
              </button>
            </div>
            
            <div className="h-80 overflow-y-auto bg-gray-50 p-2 rounded-md">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No logs yet</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-2 rounded-md ${
                        log.type === 'error' 
                          ? 'bg-red-100 text-red-800' 
                          : log.type === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <div className="font-mono">[{new Date(log.timestamp).toLocaleTimeString()}]</div>
                      <div className="font-semibold">{log.message}</div>
                      {log.data && (
                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all">
                          {typeof log.data === 'object' 
                            ? JSON.stringify(log.data, null, 2) 
                            : String(log.data)
                          }
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { createContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

const ethereum = window.ethereum;
export const ConnectContext = createContext();

export function WalletConnectProvider({children}) {
    const [walletState, setWalletState] = useState({
        address:         null,
        chainId:         null,
        signer:          null,
        balance:         0,
        connected:       false,
        browserProvider: null
    });

    async function checkConnection() {
        if (ethereum) {
            let accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length) {
                if (walletState.address == null && accounts[0]) {
                    connectWallet();
                }
            }
        }
    }

    async function handleAccountsChange(accounts) {
        if (accounts && accounts[0]) {
            let walletSt = await updateWallet(accounts);
            setWalletState({...walletSt});
        } else {
            disconnectWallet();
        }
    }

    useEffect(() => {
        checkConnection();

        if (ethereum) {
            ethereum.on('accountsChanged', handleAccountsChange);
        }
        
        return () => {
            if (ethereum) {
                ethereum.removeListener('accountsChanged', handleAccountsChange);
            }
        }
    }, []);

    function createWalletObj(address, chainId, signer, balance, browserProvider) {
        return {
            address,
            chainId,
            signer,
            balance,
            connected: address ? true : false,
            browserProvider
        }
    }

    function disconnectWallet() {
        setWalletState({...createWalletObj(null, null, null, 0, null)});
    }

    async function updateWallet(accounts) {
        let provider = new BrowserProvider(ethereum);
        const address = accounts[0];
        return createWalletObj(
            address, 
            await provider.getNetwork(), 
            await provider.getSigner(), 
            await provider.getBalance(address),
            provider
        );
    }

    async function connectWallet() {
        let walletSt = {
            address:   null,
            signer:    null,
            chainId:   null,
            balance:   0,
            connected: false
        };

        try {

            let accounts = await ethereum.request({method: 'eth_requestAccounts'});
            walletSt = await updateWallet(accounts);

        } catch (error) {
            walletSt = createWalletObj(null, null, null, null, 0, null);
        }
        setWalletState({...walletSt});
    }

    return (
        <ConnectContext.Provider value={{walletState, connectWallet}}>
            {children}
        </ConnectContext.Provider>
    );
}
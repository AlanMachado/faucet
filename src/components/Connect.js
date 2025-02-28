import { useContext } from "react";
import { ConnectContext } from "./WalletConnectProvider";
import { formatWalletAddress } from "../utils/walletUtils";


function Connect() {
    const { walletState , connectWallet } = useContext(ConnectContext);

    const onConnect = async () => {
        await connectWallet();
    }

    return (
        <>
            <button className="primary-button" 
                onClick={!walletState.conneceted ? onConnect : undefined}
                title={!walletState.conneceted ? walletState.address : "Connect"}>
                {walletState.connected ? formatWalletAddress(walletState.address) : "Connect"}
            </button>
        </>
    )
}

export default Connect;
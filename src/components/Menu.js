import { useContext } from "react";
import { ConnectContext } from "./WalletConnectProvider";
import Connect from "./Connect";

function Menu() {
    const {walletState} = useContext(ConnectContext);

    return (
        <nav className="navbar is-fixed-top" role="navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a className="navbar-item" href="#">
                        <strong style={{color: "var(--primary-color)", fontSize: "1.5rem"}}>Fund Me</strong>
                    </a>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <Connect />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}


export default Menu;
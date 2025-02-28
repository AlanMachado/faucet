import { WalletConnectProvider } from './components/WalletConnectProvider';
import { ContractConnect } from './components/ContractConnect';
import Menu from './components/Menu';
import './App.css';

function App() {
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <WalletConnectProvider>
            <Menu />
            <ContractConnect />
          </WalletConnectProvider>
        </div>
      </div>
    </>
  );
}

export default App;

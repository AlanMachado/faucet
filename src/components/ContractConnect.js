import { JsonRpcProvider, Contract, parseUnits } from "ethers";
import { useContext, useState } from "react";
import { getContractFunctionsAsArray } from "../utils/abiUtils";
import { ConnectContext } from "./WalletConnectProvider";
import contract from "../constants/abi/FundMe.json";
import Interaction from "./Interaction";

export function ContractConnect() {
    const {walletState} = useContext(ConnectContext);
    const [contractAddress, setContractAddress] = useState('');
    const [contractFunctions, setContractFunctions] = useState([]);
    const [valueToFund, setValueToFund] = useState();
    const abi = contract.abi;

    const handleContractAddressChange = (e) => {
        setContractAddress(e.target.value);
    }

    const handleValueToFund = (e) => {
        setValueToFund(e.target.value);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const provider = new JsonRpcProvider("http://127.0.0.1:8545");
        async function getContractFunctions() {
            try {
                await provider.getCode(contractAddress);
                setContractFunctions(getContractFunctionsAsArray(abi));
                console.log(getContractFunctionsAsArray(abi));
            } catch (error) {
                setContractFunctions([]);
            }
        }
        
        await getContractFunctions();
    }

    const handleContractInteraction = async (functionName, state, ...values) => {
        let result;
        try {
            const provider = walletState.browserProvider;
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, abi, signer);
            
            const toSend = {
                value: parseUnits(valueToFund ? valueToFund : '0', 18)
            }
            
            if (values.length) {
                result = await contract[functionName](...values, state === 'payable' ? toSend: {});
            } else {
                result = await contract[functionName](state === 'payable' ? toSend: {});
            }    
        } catch (error) {
            result = [];
            console.log(error.message);
        }

        return result;
    }


    return (
        <>
            <section className="hero is-fullheight-with-navbar">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-vcentered">
                            <div className="column" data-aos="fade-up">
                                <form onSubmit={submitForm}>
                                    <h1 className="title is-1 mb-4" style={{fontWeight: 800}}>
                                        Contract address
                                    </h1>
                                    <div className="control mb-4">
                                        <input
                                            className="input is-rounded is-large"
                                            type="text"
                                            id="contractAddress"
                                            name="contractAddress"
                                            placeholder="0x...9a9a"
                                            onChange={handleContractAddressChange}
                                            value={contractAddress}
                                        />
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button
                                                type="submit"
                                                className="button is-primary is-large is-fullwidth"
                                            >
                                                Get contract
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="column">
                                <div className="control mb-4">
                                    <input
                                        className="input is-rounded is-large"
                                        type="text"
                                        id="valueToFund"
                                        name="Eth"
                                        placeholder="0.00000000000"
                                        onChange={handleValueToFund}
                                        value={valueToFund}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="fixed-grid has-3-cols">
                <div className="grid is-col-min-31 is-gap-0">
                    {contractFunctions && contractFunctions.map((func) => {
                        return <div className="cell" key={func.name}><Interaction name={func.name} state={func.stateMutability} inputs={func.inputs} outputs={func.outputs} handleContractInteraction={handleContractInteraction}/></div>
                    })}
                </div>
            </div>
        </>
    );
}


import { useRef, useState } from "react";
import { ethers } from "ethers";
import { TransactionResponse } from "ethers";

function Interaction({name, state, inputs, outputs, handleContractInteraction}) {
    const inputRefs = useRef([]);
    const [results, setResults] = useState([]);
    
    const setInputRef = (el) => {
        if (el && !inputRefs.current.includes(el)) {
          inputRefs.current.push(el);
        }
    };

    const buttonType = {
        view: "is-info",
        payable: "is-danger",
        nonpayable: "is-info"
    }

    const typePlaceholder = {
        address: "0x...0000",
        uint256: "0",
        int256:  "0",
        string:  "...",
    }

    const concatArray = (array, field) => {
        return array.map(a => a[field]).join(",");
    }

    const formatInts = (value) => {
        return value.toString().length >= 18 ?  ethers.formatEther(value, 18) : value.toString();
    }

    const callContractInteraction = async (e) => {
        const inputTargets = e.target.dataset.inputTargets;
        const outputTypes = e.target.dataset.outputTypes.split(',');
        
        const functionName = e.target.id; 
        const values = inputRefs.current.map(ref => ref.value);

        let result;
        if (inputTargets.length) {
            result = await handleContractInteraction(functionName, state, ...values);
        } else {
            result = await handleContractInteraction(functionName, state);
        }

        if (result instanceof Array) {
            result = result.map((r, index) => {
                const value = formatInts(r);
                return outputTypes[index].includes("int") && value ? value : r;
            });
        } else if (result instanceof TransactionResponse){
            try {
                const contractTransactionReceipt = await result.wait();
    
                result = [
                    contractTransactionReceipt.blockHash, 
                    contractTransactionReceipt.status === 1 ? 'Success' : 'Fail'
                ];    
            } catch (error) {
                result = ['Fail'];
            }
        } else {
            const value = formatInts(result);
            result = [outputTypes[0].includes("int") && value ? value : result];
        }

        setResults(result);
    }

    return (
        <>
            <div className="column" data-aos="fade-up">
                <div className="card p-6">
                    <i className="fas fa-wallet feature-icon mb-4"></i>
                    <div className="field is-grouped">
                        <div className="control">
                            <button className={`button ${buttonType[state]}`} id={name} onClick={callContractInteraction} data-output-types={outputs && concatArray(outputs, "type")} data-input-targets={inputs && concatArray(inputs, "name")}>{name.toLowerCase().replace("_", " ")}</button>
                        </div>
                    </div>
                    {inputs && inputs.map((input) => {
                        return <div className="control mb-4" key={input.name}> <input key={input.name} id={input.name} type="text" className="input" placeholder={typePlaceholder[input.type]} ref={setInputRef} /> </div>
                    })}
                    {results && results.map(r => {
                        return <div className="field">{r}</div>
                    })}
                </div>
            </div>
        </>
    )
}


export default Interaction;
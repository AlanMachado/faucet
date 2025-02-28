const getFunctionAbi = (abi) => {
    return abi.filter(item => item.type === 'function');
};

export const getContractFunctions = (abi) => {
    const functions = getFunctionAbi(abi);
    return {
        view: functions.filter(fn => fn.stateMutability === 'view'),
        write: functions.filter(fn => ['nonpayable', 'payable'].includes(fn.stateMutability)),
        //payable: functions.filter(fn => fn.stateMutability === 'payable')
    };
};

export const getContractFunctionsAsArray = (abi => {
    const functions = getFunctionAbi(abi);

    return functions.filter(fn => ['nonpayable', 'payable', 'view'].includes(fn.stateMutability))
})
export const formatWalletAddress = (address) => {
    return address.replace(/^(0x)[a-fA-F0-9]+([a-fA-F0-9]{4})$/, '$1...$2');
}
export const switchNetwork = async (provider, configs) => {
  if (!provider || !configs) return;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: configs.chainId }],
    });
  } catch (err) {
    // if no chain found request to add
    if (err.code === 4902 || /Unrecognized chain ID/.test(err.message || err))
      return await provider.request({
        method: "wallet_addEthereumChain",
        params: [configs],
      });
  }
};

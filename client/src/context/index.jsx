import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useConnect, useActiveWallet } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { clientId } from "../utils";
const StateContext = createContext();

const client = createThirdwebClient({ clientId });
const StateContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {
    const metamaskProvider = injectedProvider("io.metamask");
    console.log("Connecting wallet: ", metamaskProvider);
    if (!metamaskProvider) {
      alert("Please install the metamsk extension");
      return;
    }
    const metamaskWallet = createWallet("io.metamask");

    const account = await metamaskWallet.connect({
      client,
    });
    console.log("Account: ", account);
    setWallet(account.address);
    return account;
  };
  useEffect(() => {
    connectWallet();
  }, []);

  const publishCampaign = async (form) => {
    setLoading(true);
    try {
      if (!wallet) {
        throw new Error("No wallet connected");
      }

      // Assuming you have a contract instance available
      const data = await wallet.contract.call("createCampaign", [
        form.target,
        form.title,
        form.description,
        new Date(form.deadline).getTime(),
      ]);

      console.log("Campaign created successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to publish campaign:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    address: wallet,
    connect: connectWallet,
    createCampaign: publishCampaign,
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateContextProvider;

export const useStateContext = () => useContext(StateContext);

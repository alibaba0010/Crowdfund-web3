import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useConnect, useActiveWallet } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { clientId } from "../utils";
const StateContext = createContext();

const client = createThirdwebClient({ clientId });
const StateContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const activeWallet = useActiveWallet();
  console.log("Active wallet: " + JSON.stringify(activeWallet));
  const { connect } = useConnect();

  const connectWallet = useCallback(async () => {
    setLoading(true);
    try {
      const connectedWallet = await connect(async () => {
        const newWallet = createWallet("io.metamask");
        // connect wallet
        const result = await newWallet.connect(client);
        console.log("Result: " + result);
        // return the wallet
        return newWallet;
      });
      console.log("Connected Wallet", connectedWallet);
      setWallet(connectedWallet);
      console.log("Connected to wallet:", connectedWallet);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  }, [connect]);

  const publishCampaign = async (form) => {
    setLoading(true);
    try {
      if (!activeWallet) {
        throw new Error("No wallet connected");
      }

      // Assuming you have a contract instance available
      const data = await activeWallet.contract.call("createCampaign", [
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
    // address: activeWallet,
    // address: "0x"
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

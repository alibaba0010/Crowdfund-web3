import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import {} from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { clientId } from "../utils";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
const StateContext = createContext();

const client = createThirdwebClient({ clientId });
const StateContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");

  // get a contract
  const contract = getContract({
    // the client you have created via `createThirdwebClient()`
    client,
    // the chain the contract is deployed on
    chain: sepolia,
    // the contract's address
    address: "0x51AFcbD12376434B68dD826802049a9634cb2364",
  });
  console.log("Contract: " + JSON.stringify(contract));

  const connectWallet = async () => {
    const metamaskProvider = injectedProvider("io.metamask");
    // console.log("Connecting wallet: ", metamaskProvider);
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
      const data = await contract.call("createCampaign", [
        form.target,
        form.title,
        form.description,
        new Date(form.deadline).getTime(),
      ]);
      console.log("Data: ", data);

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

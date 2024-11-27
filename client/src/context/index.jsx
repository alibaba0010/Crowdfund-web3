import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import {
  createThirdwebClient,
  prepareContractCall,
  getContract,
  sendTransaction,
} from "thirdweb";
import { clientId } from "../utils";
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
      const transaction = prepareContractCall({
        contract,
        method:
          "function createCampaign(uint256 targetAmount, uint256 deadline, string title, string description) payable returns (uint256)",
        params: [
          form.target,
          new Date(form.deadline).getTime(),
          form.title,
          form.description,
        ],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      console.log("Data: ", transactionHash);

      console.log("Campaign created successfully:", transactionHash);
      return transaction;
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

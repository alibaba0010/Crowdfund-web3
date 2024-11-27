import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import {
  createThirdwebClient,
  prepareContractCall,
  getContract,
} from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { clientId, contractABI } from "../utils";
import { sepolia } from "thirdweb/chains";
const StateContext = createContext();

const client = createThirdwebClient({ clientId });

const StateContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");
  // const { mutate: sendTransaction } = useSendTransaction();

  // get a contract
  const contract = getContract({
    client,
    chain: sepolia,
    address: "0x51AFcbD12376434B68dD826802049a9634cb2364",
    abi: contractABI,
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
    console.log("Form : ", form);

    setLoading(true);
    try {
      if (!wallet) {
        throw new Error("No wallet connected");
      }

      const transaction = prepareContractCall({
        contract,
        method: "createCampaign",
        params: [
          form.target,
          new Date(form.deadline).getTime(),
          form.title,
          form.description,
        ],
      });

      console.log("Campaign created successfully:", transaction);
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

import { useContext, createContext, useState, useEffect } from "react";
import StateContext from "./context";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useConnect, useActiveWallet } from "thirdweb/react";
import { ethers } from "ethers";
// import { EditionMetadataWithOwnerOutputSchema } from "thirdweb/sdk";
import PropTypes from "prop-types";
import { clientId } from "../utils";
import { createThirdwebClient } from "thirdweb";
const client = createThirdwebClient({ clientId });
const StateContextProvider = ({ children }) => {
  // const address = useAddress();
  const [loading, isLoading] = useState("");

  const connect = useConnect();
  const connectWallet = async () => {
    connect(async () => {
      const wallet = createWallet("io.metamask"); // pass the wallet id

      // if user has wallet installed, connect to it
      if (injectedProvider("io.metamask")) {
        await wallet.connect({ client });
      }

      // open WalletConnect modal so user can scan the QR code and connect
      else {
        await wallet.connect({
          client,
          walletConnect: { showQrModal: true },
        });
      }
      return wallet;
    });
  };
  useEffect(() => {
    const wallet = connectWallet();
    console.log("Connected to wallet: " + wallet);
  }, []);
  // const wallet = useActiveWallet();
  // console.log("connected to ", wallet);
  const publishCampaign = async (form) => {
    console.log("Form: " + form);
    try {
      if (!wallet) {
        throw new Error("No wallet connected");
      }
      const data = await createCampaign({
        args: [
          // address, // owner
          form.target,
          form.title, // title
          form.description, // description
          new Date(form.deadline).getTime(), // deadline,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  return (
    <StateContext.Provider
      value={{
        // address,
        // contract,
        connectWallet,
        wallet,
        createCampaign: publishCampaign,
        // getCampaigns,
        // getUserCampaigns,
        // donate,
        // getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateContextProvider;

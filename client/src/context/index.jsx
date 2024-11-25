import { useContext, createContext, useState } from "react";

import {
  useAddress,
  useContract,
  useContractWrite,
  useConnect,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";
import PropTypes from "prop-types";

const StateContextProvider = ({ children }) => {
  // const address = useAddress();
  const [loading, isLoading] = useState("");
  const connect = useConnect();
  return <div>index</div>;
};

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateContextProvider;

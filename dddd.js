const StateContextProvider = ({ children }) => {
  const metamaskConfig = metamaskWallet();
  const { contract } = useContract(
    "0x51AFcbD12376434B68dD826802049a9634cb2364"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const getCampaigns = async () => {
    // const campaigns = await contract.call('getCampaigns');
    // const parsedCampaings = campaigns.map((campaign, i) => ({
    //   owner: campaign.owner,
    //   title: campaign.title,
    //   description: campaign.description,
    //   target: ethers.utils.formatEther(campaign.target.toString()),
    //   deadline: campaign.deadline.toNumber(),
    //   amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
    //   image: campaign.image,
    //   pId: i
    // }));
    // return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    // const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    // return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    // const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});
    // return data;
  };

  const getDonations = async (pId) => {
    // const donations = await contract.call('getDonators', [pId]);
    // const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    // for(let i = 0; i < numberOfDonations; i++) {
    //   parsedDonations.push({
    //     donator: donations[0][i],
    //     donation: ethers.utils.formatEther(donations[1][i].toString())
    //   })
    // }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

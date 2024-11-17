// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract GoFundme {
constructor() payable {}
    struct Campaign {
        address payable creator;
        // new params
        string title; 
        string description;
        uint256 targetAmount;
        uint256 deadline; // Unix timestamp (seconds since epoch)
        uint256 totalDonated;
        mapping(address => uint256) donations; //   
        address[] donators; // Tracks individual donor contributions
        bool withdrawn;
        bool reachedDeadline;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount; // Keeps track of the number of campaigns

    // Event to notify when a campaign is created
    event CampaignCreated(uint256 campaignId, address creator, uint256 targetAmount, uint256 deadline, string title, string description);

    // Event to notify when a donation is made
    event DonationMade(uint256 campaignId, address donor, uint256 amount);

    // Event to notify when funds are withdrawn
    event FundsWithdrawn(uint256 campaignId, address creator, uint256 amount);

    modifier campaignExists(uint campaignId) {
        require(campaignId < campaignCount, "Campaign does not exist");
        _;
    }
// 1. Create a new campaign
    function createCampaign(uint256 targetAmount, uint256 deadline, string memory title, string memory description) public payable returns (uint256){
        require(targetAmount > 0, "Target amount must be greater than zero.");
        require(deadline > block.timestamp, "Deadline must be in the future.");

 Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = payable(msg.sender);
        newCampaign.targetAmount = targetAmount;
        newCampaign.title = title;
        newCampaign.description = description;
        newCampaign.deadline = deadline;
        newCampaign.totalDonated = 0;
        newCampaign.reachedDeadline = false;
        newCampaign.withdrawn = false;  

        emit CampaignCreated(campaignCount, msg.sender, targetAmount, deadline, title, description);
        campaignCount++; // Increment campaign count
        return  campaignCount - 1;
    }
// 2, Donate to the campaign
    function donate(uint256 campaignId) public payable campaignExists(campaignId){
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.withdrawn, "Campaign funds already withdrawn.");
        require(block.timestamp <= campaign.deadline, "Campaign has expired");
        require(!campaign.reachedDeadline, "Campaign deadline has passed.");

   if (campaign.donations[msg.sender] == 0) {
            campaign.donators.push(msg.sender); // Add the donor if not already present
        }

       
        campaign.totalDonated += msg.value;
        campaign.donations[msg.sender] = campaign.donations[msg.sender] + msg.value;

// to send to the campaign owner directly
// (bool sent,) = payable (campaign.creator).call{value: msg.value}("");
// if(sent) {}else {revert();

        emit DonationMade(campaignId, msg.sender, msg.value);
    }
// 3. Check if campaign hasn't exist the deadline
    function checkDeadline(uint256 campaignId) public view campaignExists(campaignId) returns (bool) {
        Campaign storage campaign = campaigns[campaignId];
        return campaign.deadline <= block.timestamp;
    }
// 4. Check if the target for the deadline has been reached 
    function checkTargetReached(uint256 campaignId) public view campaignExists(campaignId) returns (bool) {
        Campaign storage campaign = campaigns[campaignId];
        return campaign.totalDonated == campaign.targetAmount;
    }
// 5. Withdraw funds by the campaign creator
    function withdrawFunds(uint256 campaignId) campaignExists(campaignId) public {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.creator == msg.sender, "Only the creator can withdraw funds.");
        require(campaign.withdrawn == true, "Funds already withdrawn.");
        require(checkTargetReached(campaignId) && !checkDeadline(campaignId), "Target not reached or deadline passed.");
        uint256 amount = campaign.totalDonated;
        campaign.creator.transfer(amount);
        campaign.withdrawn = true;
        campaign.reachedDeadline = true; // Set to true to prevent future withdrawals

        emit FundsWithdrawn(campaignId, msg.sender, amount);
    }
// 6. Fetch the balance for a campaign
    function getBalance(uint256 campaignId) campaignExists(campaignId) public view returns (uint256) {
        Campaign storage campaign = campaigns[campaignId];
        require(campaignId <= campaignCount, "Invalid campaign ID.");
        return campaign.totalDonated;
    }
    // 7. Get donators
   function getDonors(uint256 campaignId) public view campaignExists(campaignId) returns (address[] memory) {
        Campaign storage campaign = campaigns[campaignId];
        return campaign.donators;
    }

// 8, get all campaigns for a particular creator
function getCampaignsByCreator(address creator) public view returns (uint256[] memory) {
    uint256[] memory result = new uint256[](campaignCount);
    uint256 count = 0;

    for (uint256 i = 0; i < campaignCount; i++) {
        if (campaigns[i].creator == creator) {
            result[count] = i;
            count++;
        }
    }

    // Resize the array to fit the actual count
    uint256[] memory filteredResult = new uint256[](count);
    for (uint256 j = 0; j < count; j++) {
        filteredResult[j] = result[j];
    }

    return filteredResult;
}


}
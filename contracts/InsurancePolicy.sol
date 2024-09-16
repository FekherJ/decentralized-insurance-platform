// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsurancePolicy {
    struct Policy {
        address insured;
        uint256 premium;
        uint256 payoutAmount;
        string eventType;
        bool isActive;
    }

    mapping(uint256 => Policy) public policies;
    uint256 public policyCounter;

    address public owner;
    address public oracle; // We don't need AggregatorV3Interface anymore, just the address for the mock

    event PolicyCreated(uint256 policyId, address insured, uint256 premium, string eventType);
    event ClaimPaid(uint256 policyId, address insured, uint256 payoutAmount);
    event PolicyUpdated(uint256 policyId, bool isActive);

    constructor(address _oracleAddress) {
        owner = msg.sender;
        oracle = _oracleAddress;  // Use the mock oracle address during deployment
    }

    // Function to create a new insurance policy
    function createPolicy(
        address _insured,
        uint256 _premium,
        uint256 _payoutAmount,
        string memory _eventType
    ) public {
        require(msg.sender == owner, "Only the contract owner can create policies");

        policies[policyCounter] = Policy({
            insured: _insured,
            premium: _premium,
            payoutAmount: _payoutAmount,
            eventType: _eventType,
            isActive: true
        });

        emit PolicyCreated(policyCounter, _insured, _premium, _eventType);
        policyCounter++;
    }

    // Function to pay the claim
    function payClaim(uint256 _policyId) public {
        require(policies[_policyId].isActive, "Policy is not active");
        require(address(this).balance >= policies[_policyId].payoutAmount, "Insufficient funds");

        policies[_policyId].isActive = false; // Deactivate the policy after payout
        payable(policies[_policyId].insured).transfer(policies[_policyId].payoutAmount);

        emit ClaimPaid(_policyId, policies[_policyId].insured, policies[_policyId].payoutAmount);
    }

    // Function to check an external condition and update the policy status
    function checkExternalCondition(uint256 _policyId, int256 _triggerCondition) public {
        require(policies[_policyId].isActive, "Policy is not active");

        (, int256 latestData, , , ) = MockV3Aggregator(oracle).latestRoundData();  // Fetch data from mock oracle

        // Compare the fetched data with the trigger condition
        if (latestData >= _triggerCondition) {
            policies[_policyId].isActive = false;
            emit PolicyUpdated(_policyId, false);
        }
    }

    // Allow the contract to receive funds
    receive() external payable {}
}

interface MockV3Aggregator {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

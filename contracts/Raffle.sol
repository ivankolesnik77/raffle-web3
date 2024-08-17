pragma solidity ^0.8.8; // SPDX-License-Identifier: MIT

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

error FundMe__NotOwner();
error FundMe__NotEnoughFund();
error Raffle__NotEnoughETHEntered();

/**
 * @title contract for crowd funding
 * @author Ivan Kolesnik
 * @notice This contract is to demo a sample contract
 * @dev This implements price feed
 */
contract Raffle is VRFConsumerBaseV2 {
      address[] public s_players;
      uint256 private immutable i_entranceFee;
      uint256 public constant REQUEST_CONFIRMATIONS = 3;
      uint256 public constant NUMBER_WORDS = 1;
      VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
      uint256 private immutable i_subscriptionId;
      uint256 private immutable i_callbackGasLimit;
      uint256 private immutable i_gasLine;
      address private s_recentWinner;
      uint256 private immutable interval;
      uint256 private lastTimeStamp;
      event RaffleEnter(address indexed sender);
      event RequestedRaffleWinner(uint256 indexed requestId);

      constructor(
            address _vrfCoordinator,
            uint256 _gasLine,
            uint256 _entranceFee,
            uint256 _subscriptionId,
            uint256 callbackGasLimit,
            uint256 updateInterval
      ) VRFConsumerBaseV2(_vrfCoordinator) {
            i_gasLine = _gasLine;
            i_entranceFee = _entranceFee;
            i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
            i_subscriptionId = _subscriptionId;
            i_callbackGasLimit = callbackGasLimit;
            interval = updateInterval;
            lastTimeStamp = block.timestamp;
      }

      function checkUpkeep(
            bytes calldata /* checkData */
      )
            external
            override
            returns (bool upkeepNeeded, bytes memory performData)
      {
            upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
            performData = upkeepNeeded
      }

      function enterRaffle() public {
            if (msg.value < i_entranceFee) {
                  revert Raffle__NotEnoughETHEntered();
            }
            s_players.push(payable(msg.sender));
            emit RaffleEnter(msg.sender);
      }

      function pickRandomWinner() external {
            uint256 requestId = i_vrfCoordinator.requestRandomWords(
                  i_subscriptionId,
                  REQUEST_CONFIRMATIONS,
                  i_callbackGasLimit,
                  NUMBER_WORDS
            );
            emit RequestedRaffleWinner(requestId);
      }

      function fulfillRandomWords(
            uint256 requestId,
            uint256[] calldata randomWords
      ) external override {
            uint256 indexOfWinner = randomWords[0] % s_players.length;
            address recentWinner = s_players[indexOfWinner];
            s_recentWinner = recentWinner;
            (bool success, ) = s_recentWinner.call{
                  value: address(msg.sender).balance
            }("");
      }

      function getEntranceFee() public view returns (uint256) {
            return i_entranceFee;
      }

      function getPlayer(uint256 index) public view returns (address) {
            return s_players[index];
      }

      function getRecentWinner() public view returns (address) {
            return s_recentWinner;
      }
}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly

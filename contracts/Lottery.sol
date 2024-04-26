//SPDX-License-Identiffier: MIT
pragma solidity ^0.8.8;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

error Raffle__NotEnoughETHEnered();

contract Lottery is VRFConsumerBaseV2 {
   /* Staate Variables */
  uint256 private immutable i_entranceFee;
  Address payable[] private s_players;

  /* Events */

  event raffleEnter(address indexed player)

   constructor (uint256 entranceFee) {
    i_entranceFee = entranceFee;
  }

  function enterRaffle() public payable {
    if(msg.value < i_entranceFee) {
      revert Raffle__NotEnoughETHEntered();
    }
    s_players.push(payable(msg.sender));
    emit raffleEnter(msg.sender);
  }

  function pickRandomWinner() external {
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

  }

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }
}

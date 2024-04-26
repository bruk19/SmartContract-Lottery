//SPDX-License-Identiffier: MIT

pragma solidity ^0.8.8;

error Raffle__NotEnoughETHEnered();

contract Lottery {
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
  }

  s_players.push(payable(msg.sender));

  emit raffleEnter(msg.sender);

}
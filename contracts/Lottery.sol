//SPDX-License-Identiffier: MIT

pragma solidity ^0.8.8;

error Raffle__NotEnoughETHEnered();

contract Lottery {
  uint256 private immutable i_entranceFee;

   constructor (uint256 entranceFee) {
    i_entranceFee = entranceFee;
  }

  function enterRaffle() {
    if(msg.value < i_entranceFee) {
      revert Raffle__NotEnoughETHEntered();
    }
  }

}
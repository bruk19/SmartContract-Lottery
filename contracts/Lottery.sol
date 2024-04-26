//SPDX-License-Identiffier: MIT

pragma solidity ^0.8.8;

contract Lottery {
  uint256 private immutable i_entranceFee;

   constructor (uint256 entranceFee) {
    i_entranceFee = entranceFee;
  }

  function enterRaffle() {
  }

}
//SPDX-License-Identiffier: MIT
pragma solidity ^0.8.8;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

error Raffle__NotEnoughETHEntered();

contract Lottery is VRFConsumerBaseV2 {
    /* Staate Variables */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private s_vrfCoordinatorV2;
    uint64 public s_entranceFee;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3; 
    uint32 private immutable i_callbackGasLimit;
    uint32 private immutable i_numWord;

    /* Events */

    event raffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId)

    constructor(address vrfCoordinatorV2, uint256 entranceFee, byte32 memory gasLane, uint64 subscriptionId, uint16 requestConfirmation, uint32 callbackGasLimit, uint32 numWord) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        s_vrfCoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        s_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_numWord = numWord;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        emit raffleEnter(msg.sender);
    }

    function pickRandomWinner() external {
        uint256 requestId = _vrfCoordinatorV2.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            i_numWords
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}

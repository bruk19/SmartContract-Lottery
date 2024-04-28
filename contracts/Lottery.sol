//SPDX-License-Identiffier: MIT
pragma solidity ^0.8.8;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

error Raffle__NotEnoughETHEntered();
error Raffle_TransferFailed();
error RAffle__NotOpen();
error Raffle__UpKeepNotNeeded(uint currentBalance, uint256 numPlayers, uint256 raffleStates);

contract Lottery is VRFConsumerBaseV2, AutomationCompatible {
    enum RaffleState {
        OPEN,
        CAlCULATING
    }
    /* Staate Variables */
    uint64 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private s_vrfCoordinatorV2;
    uint64 public s_entranceFee;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private immutable i_numWord;

    address private s_recentWinner;
    RaffleState private s_raffleState;
    bool private isOpen;
    uint256 private s_lastTimeStamp;
    uint256 private s_interval;

    /* Events */

    event raffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event pickedWinner(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint64 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint16 requestConfirmation,
        uint32 callbackGasLimit,
        uint32 numWord,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        s_vrfCoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        s_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_numWord = numWord;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        s_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert RAffle__NotOpen();
        }
        s_players.push(payable(msg.sender));
        emit raffleEnter(msg.sender);
    }

    function checkUpKeep(
        bytes calldata /* checkData */
    ) public override returns (bool upKeepNeeded, bytes memory /* performData */) {
        isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0;
        bool upKeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    function performUpKeep(bytes calldat /* performData */) external override {
        (bool upKeepNeeded, ) = checkUpKeep("");
        if (!upKeepNeeded) {
            revert Raffle__UpKeepNotNeeded(
                address(this).balance,
                s_player.length,
                uint256(s_raffleState)
            );
        }

        s_raffleState = RaffleState.CAlCULATING;
        uint256 requestId = s_vrfCoordinatorV2.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            i_numWord
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle_TransferFailed();
        }

        emit pickedWinner(s_recentWinner);
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

    function getRaffleState() public vew returns (RaffleState) {
      return s_raffleState;
    }
}

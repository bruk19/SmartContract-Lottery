const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
// import hardhat from "hardhat";
const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = ("chai");

!developmentChains.includes(network.name)
  ? describe.only
  : describe("Lottery Uint Test", async function () {
    let lottery, vrfCoordinatorV2Mock, raffleEntranceFee, vrfCoordinatorV2, entranceFee,gasLane, subscriptionId, callbackGasLimit, interval, GAS_PRICE_LINK
    const chainId = network.config.chainId

    beforeEach(async function () {
     const {deployer}  = await getNamedAccounts()

      await deployments.fixture(["all"])
      const _lottery = await ethers.getContractFactory("Lottery", {deployer})
      
      lottery = await _lottery.deploy(vrfCoordinatorV2, entranceFee,gasLane, subscriptionId, callbackGasLimit, interval )
      console.log(lottery)
      raffleEntranceFee = await lottery.getEntranceFee()
      console.log(raffleEntranceFee)
        
      const _vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock", {deployer})
      vrfCoordinatorV2Mock = await _vrfCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK) 
    
    })

    describe("constructor", async function () {
      it("initializes the lottery correctly", async function () {
        const raffleState = await lottery.getRaffleState()
        const interval = await lottery.getInterval()
        assert.equal(raffleState.toString(), "0")
        assert.equal(interval.toString(), networkConfig[chainId]["interval"])
      })

      it("lottery initializes intrance Fee correctly", async function () {
        const intranceFee = await lottery.getEntranceFee()
        assert.equal(intranceFee.toString(), networkConfig.chainId["entarnceFee"])
      })
    })

    describe("enterRaffle", async function () {
      it("entrance fails because of not enough fee", async function () {
        await expect(lottery.entarnceFee()).to.be.revertedWith(
          "Raffle__NotEnoughETHEntered"
        )
      })

      it("records players when they enter", async function () {
        await lottery.enterRaffle({ value: raffleEntranceFee })
        const playerFromContract = await lottery.getPlayer(0)
        assert.equal(playerFromContract, deployer)
      })
    })
  })

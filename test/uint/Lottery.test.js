const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
// import hardhat from "hardhat";
const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert } = ("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery Uint Test", async function () {
    let lottery, vrfCoordinatorV2Mock, raffleEntranceFee, deployer
    const chainId = network.config.chainId

    beforeEach(async function () {
      const { deployer } = await getNamedAccounts()
      await deployments.fixture(["all"])
      lottery = await ethers.getContractFactory("Lottery", deployer)
      vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock", deployer)
      raffleEntranceFee = await raffle.getEntranceFee()
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
    })
  })

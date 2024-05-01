const { developmentChains, networkConfig } = requrie ("../../helper-hardhat-config")
import hardhat from "hardhat";
const { ethers, getNamedAccounts, deployments } = hardhat;
import { assert } from "chai";

!developmentChains.includes(network.name)
  ? describe.skip
  : desscribe("Lottery Uint Test", async function () {
    let lottery, vrfCoordinatorV2Mock
    const chainId = network.config.chainId

    beforeEach(async function () {
      const { deployer } = await getNamedAccounts()
      await deployments.fixture(["all"])
      lottery = await ethers.getContractFactory("Lottery", deployer)
      vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock", deployer)
    })

    describe("constructor", async function () {
      it("initializes the lottery correctly", async function () {
        const raffleState = await lottery.getRaffleState()
        const interval = await lottery.getInterval()
        assert.equal(raffleState.toString(), "0")
        assert.equal(interval.toString(), networkConfig[chainId]["interval"])

      })
    })
  })
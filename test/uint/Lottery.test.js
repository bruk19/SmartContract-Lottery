const { developmentChains } = require("../../helper-hardhat-config")
const { ethers, getNamedAccounts, deployments } = require("hardhat")

!developmentChains.includes(network.name)
  ? describe.skip
  : desscribe("Lottery Uint Test", async function () {
    let lottery, vrfCoordinatorV2Mock

    beforeEach(async function () {
      const { deployer } = await getNamedAccounts()
      await deployments.fixture(["all"])
      lottery = await ethers.getContractFactory("Lottery", deployer)
      vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock", deployer)
    })
  })
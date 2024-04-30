const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const FUND_AMOUNT = ethers.parseEther("1")
const BASE_FEE = ethers.parseEther("0.25");
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock, vrf_Coordinatorv2Mokck

  if (chainId == 31337) {
    vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
    vrf_Coordinatorv2Mokck = await vrfCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
    console.log(vrf_Coordinatorv2Mokck.target)
    /*subID */
    const transactionResponse = await vrf_Coordinatorv2Mokck.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)
    const events = transactionReceipt.events || []; // Check if events array is empty
    if (events.length > 0) {
      subscriptionId = events[0].args.subId;
      // Fund the subscription
      await vrfCoordinatorV2MockInstance.fundSubscription(subscriptionId, FUND_AMOUNT);
    }
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    subscriptionId = networkConfig[chainId]["subscriptionId"]
  }

  const arguments = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["keepersUpdateInterval"],
    networkConfig[chainId]["raffleEntranceFee"],
    networkConfig[chainId]["callbackGasLimit"],
  ]

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!chainId == 31337 && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(lottery.address, args)
  }
  log("----------------------------------")
}
module.exports.tags = ["all", "lottery"]
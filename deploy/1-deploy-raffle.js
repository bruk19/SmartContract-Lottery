const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const FUND_AMOUNT = ethers.parseUnits("1", 16)
const BASE_FEE = ethers.parseEther("25", 16);
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock, vrf_Coordinatorv2Mokck

  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")

    vrf_Coordinatorv2Mokck = await vrfCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
    vrfCoordinatorV2Address = vrf_Coordinatorv2Mokck.target
    /*subID */
    const transactionResponse = await vrf_Coordinatorv2Mokck.createSubscription()
    const transactionReceipt = await transactionResponse.wait()
    // console.log(transactionReceipt)
    // const events = transactionReceipt.events || [];
    const events = (await vrf_Coordinatorv2Mokck.queryFilter(vrf_Coordinatorv2Mokck.filters.SubscriptionCreated()))
    //console.log(event[0].args[0])
    if (events.length > 0) {
      subscriptionId = Number(events[0].args[0]);
      // Fund the subscription
      await vrf_Coordinatorv2Mokck.fundSubscription(subscriptionId, FUND_AMOUNT);
    }
  }

  else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    subscriptionId = networkConfig[chainId]["subscriptionId"]
    console.log(vrfCoordinatorV2Address)
  }

  const arguments = [
    vrfCoordinatorV2Address,
    networkConfig[chainId]["entranceFee"],
    networkConfig[chainId]["gasLane"],
    subscriptionId,
    networkConfig[chainId]["callbackGasLimit"],
    networkConfig[chainId]["interval"],
  ]
  
  const lottery = await deploy("Lottery", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(lottery.target, arguments)
  }
  log("----------------------------------")
}
module.exports.tags = ["all", "lottery"]

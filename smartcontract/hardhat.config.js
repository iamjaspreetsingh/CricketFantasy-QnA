/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");



module.exports = {
  solidity: {
    compilers: [
     {
      version:"0.7.0",
      settings:{
      optimizer: {
        enabled: true,
        runs: 200
      }
    }},
    {
      version:"0.8.0",
      settings:{
      optimizer: {
        enabled: true,
        runs: 200
      }
    }}

    ]},
  defaultNetwork: "hardhat",

  networks:{
   
    matictest: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [`${process.env.PKEY}`]
    }
  },

  etherscan: {
    apiKey: 'WGAQCNUDQCFRQJH9D72G94BZ83STGRJCX6'
  },
   
};
 
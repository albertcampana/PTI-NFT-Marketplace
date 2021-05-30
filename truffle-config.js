require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "82.223.19.185", //localhost:"127.0.0.1",//guigue.es:"82.223.19.185",
      port: 8546, // localhost:7545 //deploy: 8546
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    dashboard: {},
    loc_desci_desci: {
      network_id: "*",
      port: 8000,
      host: "127.0.0.1"
    },
    loc_desciv1_desciv1: {
      network_id: "*",
      port: 7546,
      host: "127.0.0.1"
    }
  },
  compilers: {
    solc: {
      version: "0.8.13"
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1"
  }
};

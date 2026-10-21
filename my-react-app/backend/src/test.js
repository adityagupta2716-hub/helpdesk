// test.js
const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.sk9fujn.mongodb.net",
  (err, records) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(records);
  }
);
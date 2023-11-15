const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");
const {utf8ToBytes}= require("ethereum-cryptography/utils");
const JSONbig = require('json-bigint');

app.use(cors());
app.use(express.json());

const balances = {
  "0361a4d74cf549cde9a7fc9628feb8dc156aa7636c7564ae532f0855f3f173e53f": 100,
  "02e8d1c906a14d6ebecb23c67457ecabd7d0a4a3b4ae9384fdaa78a3be5c8eca83": 50,
  "021a617c79b69d9904b99e826cdb423edd7fabf24c83b6e9eebce82d348f1aaa57": 75,
};

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  console.log("balance: address on server: ", address);
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, msg, sigStringed, recipient, amount } = req.body;

  console.log("signature from server: ", sigStringed);
  // convert stringified bigints back to bigints
  let sig = {
    ...sigStringed,
    r: BigInt(sigStringed.r),
    s: BigInt(sigStringed.s)
  }

  let isOk = secp.secp256k1.verify(sig, hashMessage(msg), sender) === true;
  console.log("verify = ", isOk);
  if(!isOk) {
    console.log("Wrong address!");
    res.status(400).send({ message: "Wrong address!" });
    return;
  } else {
    console.log("Signature verified successfully!");
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

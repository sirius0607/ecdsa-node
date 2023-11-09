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
  "049895b73b7e721001f6d0e7db66c90d4ccd5e2123845194f7f71a4a3834c8ac53abed1288016bc462360e79e56eb7061ffac6a0502e54bfa26c962789fa3dac95": 100,
  "04cee348282ece57fa7d5eba401088541599ee51c67ec1b614d5984b9189975a5fb5a86d36929496832760b76106f926e24965b4efce3a0fa3b6382bf373b16ad8": 50,
  "0426ba37288d9883f700a48bca6403b9e41c3f50610386f7824e28ffc417bb31471fe7912ea36dd99f35cbe43945ef15eb3650e1955c786f952c990d9c2822a65d": 75,
};

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  //const sigStringed = req.query.sigStr;
  //const sig = new TextEncoder().encode(sigAsString);
  //let sig = new Uint8Array(Buffer.from(sigAsString));
  //let sig = Buffer.from(sigStr, "utf8");
  //let sig = utf8ToBytes(sigJson);
  //const buffer = Buffer.from(sigJson, 'utf8');
  //const sig = new Uint8Array(buffer);
  // const sig = {
  //   ...sigStringed,
  //   r: BigInt(sigStringed.r),
  //   s: BigInt(sigStringed.s)
  // }
  //const address = toHex(secp.recoverPublicKey(msgHash, sig, recoveryBit));
  console.log("address on server: ", address);
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

  // const signature = {};
  // signature.r = BigInt(sigStringed.r.slice(0, -1));
  // signature.s = BigInt(sigStringed.s.slice(0,-1));
  // signature.recovery = parseInt(sig.recovery);
  // //const signatureObj = JSON.parse(signatureJson);
  // const signatureObj2 = { r: BigInt(sigStringed.r), s: BigInt(sigStringed.s) }
  //const address = toHex(secp.recoverPublicKey(hashMessage(msg), sig, parseInt(sig.recovery)));
  // TODO always false but I don't know why
  let isOk = secp.verify(sig, hashMessage(msg), sender) === true;
  console.log("verify = ", isOk);
  if(!isOk) {
    console.log("Wrong address!");
    res.status(400).send({ message: "Wrong address!" });
    return;
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

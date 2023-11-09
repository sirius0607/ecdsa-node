//import { secp256k1 } from "ethereum-cryptography/secp256k1";
//import { toHex } from "ethereum-cryptography/utils";

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);
console.log("private key: ", toHex(privateKey));
console.log("public key: ", toHex(publicKey));

// Rob
// private key 0606eaa4be1a5c47824324120dd4794c232c1f2afee1b5204c25012e8002d700
// public key 049895b73b7e721001f6d0e7db66c90d4ccd5e2123845194f7f71a4a3834c8ac53abed1288016bc462360e79e56eb7061ffac6a0502e54bfa26c962789fa3dac95

// Luke
// private key 479b28f622ab83d0550040fa99391e929199299fe22b81b6aee73214455d7c5b
// public key 04cee348282ece57fa7d5eba401088541599ee51c67ec1b614d5984b9189975a5fb5a86d36929496832760b76106f926e24965b4efce3a0fa3b6382bf373b16ad8

// Paul
// private key d19a61cdae3292bf2671c09f58e491c76967fb883687592f925c231bb47e9618
// public key 0426ba37288d9883f700a48bca6403b9e41c3f50610386f7824e28ffc417bb31471fe7912ea36dd99f35cbe43945ef15eb3650e1955c786f952c990d9c2822a65d
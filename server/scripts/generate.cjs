//import { secp256k1 } from "ethereum-cryptography/secp256k1";
//import { toHex } from "ethereum-cryptography/utils";

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("private key: ", toHex(privateKey));
console.log("public key: ", toHex(publicKey));

// Rob
// private key 40e86180721d78187b371637fbacc3f12c661ea783bb71f160a4eedd2fa3a235
// public key 0361a4d74cf549cde9a7fc9628feb8dc156aa7636c7564ae532f0855f3f173e53f

// Luke
// private key 9a7dd7b775d34a136639812ff96a3defb056917888898f816425ef7d31f8e044
// public key 02e8d1c906a14d6ebecb23c67457ecabd7d0a4a3b4ae9384fdaa78a3be5c8eca83

// Paul
// private key ac42cedb8580584cd064f54ac29f42bd99d58a42b41081520fdb3a9d9fca384f
// public key 021a617c79b69d9904b99e826cdb423edd7fabf24c83b6e9eebce82d348f1aaa57
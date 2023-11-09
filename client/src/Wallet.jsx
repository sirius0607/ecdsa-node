import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

async function signMessage(msg, privateKey) {
  let msgHash = hashMessage(msg);
  const signature = await secp.sign(msgHash, privateKey, { recovered: true });
  return signature;
}

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp.getPublicKey(privateKey));
    const msg = `get ${balance}`;
    const [sig, recoveryBit] = await signMessage(msg, privateKey);
    console.log("address Public key: ", address);
    let msgHash = hashMessage(msg);
    // test: recover public key from signature
    const recoveredAddress = await secp.recoverPublicKey(msgHash, sig, recoveryBit);
    console.log("address Public key from sig: ", toHex(recoveredAddress));
   
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <div>Adress: {address.slice(0,20)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

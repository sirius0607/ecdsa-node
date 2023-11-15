import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

async function signMessage(msg, privateKey) {
  let msgHash = hashMessage(msg);
  return secp256k1.sign(msgHash, privateKey);
}

const stringifyBigInts = obj =>{
  for(let prop in obj){
    let value = obj[prop];
    if(typeof value === 'bigint'){
      obj[prop] = value.toString();
    }else if(typeof value === 'object' && value !== null){
      obj[prop] = stringifyBigInts(value);
    }
  }
  return obj;
}

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msg = `send ${sendAmount} to ${recipient.slice(0,20)}`;
    const signature = await signMessage(msg, privateKey);
    console.log("signature from client: ", signature);
     // stringify bigints before sending to server to avoid an error
     // Can't use JSON.stringify because it do not know how to serialize BigInts
     const sigStringed = stringifyBigInts(signature);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        msg: msg,
        sigStringed: sigStringed,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

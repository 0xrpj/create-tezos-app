import * as dotenv from "dotenv";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

dotenv.config();

const deploy = async () => {
  let file = process.argv[2];

  if (!file) {
    console.log("Pass filename to deploy! Read the docs.");
    return;
  }

  file = file.toLowerCase();

  console.log("Starting...");

  const { TEZOS_RPC_URL, ORIGINATOR_PRIVATE_KEY } = process.env;
  if (!TEZOS_RPC_URL || !ORIGINATOR_PRIVATE_KEY) {
    console.error("ENV ERROR");
    return;
  }

  const signer = await InMemorySigner.fromSecretKey(ORIGINATOR_PRIVATE_KEY);
  const Tezos = new TezosToolkit(TEZOS_RPC_URL);
  Tezos.setProvider({ signer: signer });

  try {
    const { hash, contractAddress } = await Tezos.contract.originate({
      code: require(`../contracts/build/${file}.json`),
      init: require(`../contracts/build/${file}_storage.json`),
    });

    console.log("Successfully deployed contract");
    console.log(`>> Transaction hash: ${hash}`);
    console.log(`>> Contract address: ${contractAddress}`);
  } catch (error) {
    console.log(
      `CanNOT find ${file}.json or ${file}_storage.json inside build folder. \nMake sure you've compiled the contracts.\nExiting...`
    );
  }
};

deploy();

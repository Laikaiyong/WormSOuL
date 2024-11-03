import { wormhole, signSendWait } from "@wormhole-foundation/sdk";
import algorand from "@wormhole-foundation/sdk/algorand";
import aptos from "@wormhole-foundation/sdk/aptos";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";

export const initWormhole = async () => {
  const wh = await wormhole("Testnet", [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
    sui,
  ]);

  return wh;
};

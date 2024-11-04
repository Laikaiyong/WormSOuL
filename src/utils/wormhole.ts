import {
  Wormhole,
  wormhole,
  amount,
  signSendWait,
  Network,
  ChainContext,
  Chain,
  Signer,
  ChainAddress,
} from "@wormhole-foundation/sdk";
import algorand from "@wormhole-foundation/sdk/algorand";
import aptos from "@wormhole-foundation/sdk/aptos";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";

function getEnv(key: string): string {
  if (typeof process === undefined) return "";
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var ${key}, did you forget to set values in '.env'?`);
  return val;
}

interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>,
): Promise<SignerStuff<N, C>> {
  let signer: Signer;
  const platform = chain.platform.utils()._platform;
  switch (platform) {
    case "Solana":
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), getEnv("NEXT_PUBLIC_SOL_PRIVATE_KEY"), {
        debug: true,
      });
      break;
    case "Evm":
      signer = await (await evm()).getSigner(await chain.getRpc(), getEnv("NEXT_PUBLIC_ETH_PRIVATE_KEY"));
      break;
    case "Algorand":
      signer = await (await algorand()).getSigner(await chain.getRpc(), getEnv("NEXT_PUBLIC_ALGORAND_PRIVATE_KEY"));
      break;
    case "Sui":
      signer = await (await sui()).getSigner(await chain.getRpc(), getEnv("NEXT_PUBLIC_SUI_PRIVATE_KEY"));
      break;
    case "Aptos":
      signer = await (await aptos()).getSigner(await chain.getRpc(), getEnv("NEXT_PUBLIC_APTOS_PRIVATE_KEY"));
      break;
    default:
      throw new Error("Unrecognized platform: " + platform);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

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

export const crossChainTransfer = async (to: string, inputAmount: string) => {
  const wh = await initWormhole();

  try {
      // Log the initialization of the Wormhole
      console.log("Wormhole initialized:", wh);

      const ctx = wh.getChain("Solana");
      const rcv = wh.getChain(
        to as
          | "Solana"
          | "Ethereum"
          | "Terra"
          | "Bsc"
          | "Polygon"
          | "Avalanche"
          | "Oasis"
          | "Algorand"
          | "Aurora"
          | "Fantom"
          | "Karura"
          | "Acala"
          | "Klaytn"
          | "Celo"
          | "Near"
          | "Moonbeam"
          | "Neon"
          | "Terra2"
          | "Injective"
          | "Osmosis"
          | "Sui"
          | "Aptos"
          | "Arbitrum"
          | "Optimism"
          | "Gnosis"
          | "Pythnet"
          | "Xpla"
          | "Btc"
          | "Base"
          | "Sei"
          | "Rootstock"
          | "Scroll"
          | "Mantle"
          | "Blast"
          | "Xlayer"
          | "Linea"
          | "Berachain"
          | "Seievm"
          | "Snaxchain"
          | "Unichain"
          | "Worldchain"
          | "Wormchain"
          | "Cosmoshub"
          | "Evmos"
          | "Kujira"
          | "Neutron"
          | "Celestia"
          | "Stargaze"
          | "Seda"
          | "Dymension"
          | "Provenance"
          | "Sepolia"
          | "ArbitrumSepolia"
          | "BaseSepolia"
          | "OptimismSepolia"
          | "Holesky"
          | "PolygonSepolia"
          | "MonadDevnet"
      );

      console.log("Source chain context obtained:", ctx);
      console.log("Destination chain context obtained:", rcv);

      const sender = await getSigner(ctx);
      console.log("Sender signer obtained:", sender);

      const receiver = await getSigner(rcv);
      console.log("Receiver signer obtained:", receiver);

      const sndTb = await ctx.getTokenBridge();
      console.log("Sender TokenBridge obtained:", sndTb);

      const parsedAmount = amount.units(amount.parse(inputAmount, ctx.config.nativeTokenDecimals));
      console.log("Parsed transfer amount:", parsedAmount);

      const transfer = sndTb.transfer(
          sender.address.address,
          receiver.address,
          "native",
          parsedAmount
      );

      // Source chain transaction
      console.log("Initiating transfer on source chain...");
      const sourceTxids = await signSendWait(ctx, transfer, sender.signer);
      const sourceTxId = sourceTxids[sourceTxids.length - 1]?.txid;
      console.log("Source transaction IDs:", sourceTxids);
      console.log("Source transaction ID:", sourceTxId);

      // Get Wormhole message
      const [whm] = await ctx.parseTransaction(sourceTxId);
      console.log("Wormhole message parsed:", whm);

      // Get VAA
      const vaa = await wh.getVaa(whm!, "TokenBridge:Transfer", 60_000);
      console.log("VAA obtained:", vaa);

      // Destination chain transaction
      const rcvTb = await rcv.getTokenBridge();
      console.log("Receiver TokenBridge obtained:", rcvTb);

      const redeem = rcvTb.redeem(receiver.address.address, vaa!);
      console.log("Initiating redeem on destination chain...");
      const destTxids = await signSendWait(rcv, redeem, receiver.signer);
      const destTxId = destTxids[destTxids.length - 1]?.txid;
      console.log("Destination transaction IDs:", destTxids);
      console.log("Destination transaction ID:", destTxId);

      // Check completion
      const isCompleted = await rcvTb.isTransferCompleted(vaa!);
      console.log("Transfer completion status:", isCompleted);

      // Return all relevant information
      return {
          success: true,
          sourceTxId,
          destinationTxId: destTxId,
          sourceChain: "Solana",
          destinationChain: to,
          amount: inputAmount,
          isCompleted,
          wormholeMessage: whm,
      };
  } catch (error) {
      // Log error details
      console.error("Error during transfer:", error);

      // Return error information
      return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
          sourceChain: "Solana",
          destinationChain: to,
          amount: inputAmount,
      };
  }
};
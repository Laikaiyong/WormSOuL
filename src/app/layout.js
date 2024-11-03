age
import "./globals.css";
import { WalletProviders } from "./providers";
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const config = {
  // You can use Connect with testnet chains by specifying "network":
  network: 'Testnet',
  chains: ['Solana', 'WormChain', 'Ethereum', 'Sepolia', 'ArbitrumSepolia', 'BaseSepolia', 'Avalanche'],
  rpcs: {
    Avalanche: 'https://rpc.ankr.com/avalanche_fuji',
    BaseSepolia: 'https://base-sepolia-rpc.publicnode.com',
  },
};


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "WormSOuL",
  description: "Meme Coin Management with Wormhole and SOL as main provider",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <WalletProviders>

      <body
        className={`antialiased`}
      >
        <WormholeConnect config={config} />
        {children}
      </body>
     </WalletProviders>
    </html>
  );
}

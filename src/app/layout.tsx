import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Wallet } from "./providers";
import { Toaster } from "@/components/ui/toaster"
// import WormholeConnect, {
//   WormholeConnectConfig,
// } from '@wormhole-foundation/wormhole-connect';

// const config: WormholeConnectConfig = {
//   // You can use Connect with testnet chains by specifying "network":
//   network: 'Testnet',
//   chains: ['Solana', 'Wormchain', 'Sepolia', 'ArbitrumSepolia', 'BaseSepolia', 'Avalanche'],
//   rpcs: {
//     Avalanche: 'https://rpc.ankr.com/avalanche_fuji',
//     BaseSepolia: 'https://base-sepolia-rpc.publicnode.com',
//   },
// };
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WormSOul",
  description: "Crazy app that uses wormhole",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Wallet>
      
      {children}
      <Toaster />
      </Wallet>
      </body>
    </html>
  );
}

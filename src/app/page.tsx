'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { crossChainTransfer } from '@/utils/wormhole';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

import Image from 'next/image';

// Shadcn components
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";



export default function Home() {
  const [fromChain, setFromChain] = useState('Solana');
  const [toChain, setToChain] = useState('Aptos');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memeCoins, setMemeCoins] = useState([
    { name: 'SOUL1', balance: '1000', icon: 'https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://arweave.net/PysUShwUPfn6ZEDhQODhtXzd9PI2yU-VnZP4MAfa0SY', price: 0.07, trend: 60 },
    { name: 'SOUL2', balance: '5000000', icon: 'https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://arweave.net/5J6Gmt5xda_Xo9zG4kizSePImrwYMSmaHE39bXMlwf4', price: 0.000008, trend: 45 },
    { name: 'SOUL3', balance: '420000', icon: 'https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://arweave.net/nGPJTCIh7zFmoPHIErA7AI3VqF-uS3oAVGGT0S3i_cE', price: 0.000001, trend: 75 },
  ]);
  const wallet = useWallet();


  useEffect(() => {
    const gradient = document.querySelector('.gradient-bg') as HTMLElement;
    const animate = () => {
      const time = Date.now() * 0.001;
      gradient!.style.background = `
        linear-gradient(
          ${Math.sin(time) * 360}deg,
          rgba(88, 101, 242, 0.8),
          rgba(101, 242, 149, 0.8),
          rgba(242, 101, 195, 0.8)
        )
      `;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating transfer process
    crossChainTransfer(toChain, amount);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen p-2 flex flex-col bg-[#0f0e13] text-white overflow-hidden">
      <Head>
        <title>WormSOuL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="flex justify-between items-center p-4 bg-white/10">
        <h1 className="text-2xl font-bold">Wormhole Transfer</h1>
        <WalletMultiButton />
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center py-8">
        <div className="gradient-bg fixed inset-0 opacity-30 z-[-1]"></div>
        
        <motion.h1 
          className="text-4xl font-bold text-center bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent animate-hue"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Advanced Wormhole Token Transfer
        </motion.h1>
        
        <motion.form 
          onSubmit={handleTransfer} 
          className="flex flex-col items-center mt-8 w-full max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Select className="text-black"  onValueChange={setFromChain} defaultValue={fromChain}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="From Chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Evm">Ethereum</SelectItem>
              <SelectItem value="Solana">Solana</SelectItem>
              <SelectItem value="Avalanche">Avalanche</SelectItem>
              <SelectItem value="Aptos">Aptos</SelectItem>
              <SelectItem value="Algorand">Algorand</SelectItem>
              <SelectItem value="Sui">Sui</SelectItem>
            </SelectContent>
          </Select>

          <Select className="text-black" onValueChange={setToChain} defaultValue={toChain}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="To Chain" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="Evm">Ethereum</SelectItem>
            <SelectItem value="Solana">Solana</SelectItem>
            <SelectItem value="Avalanche">Avalanche</SelectItem>
            <SelectItem value="Aptos">Aptos</SelectItem>
            <SelectItem value="Algorand">Algorand</SelectItem>
            <SelectItem value="Sui">Sui</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="mb-4"
          />

          <Button 
            type="submit" 
            disabled={isLoading || !wallet.connected}
            className="w-full"
          >
            {isLoading ? 'Transferring...' : (wallet.connected ? 'Transfer' : 'Connect Wallet to Transfer')}
          </Button>
        </motion.form>

        {isLoading && (
          <motion.div 
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        )}

        <motion.div
          className="mt-8 w-full max-w-4xl bg-white/10 rounded-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Meme Coin Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memeCoins.map((coin) => (
              <Card key={coin.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{coin.name}</span>
                    <Image src={coin.icon} alt={coin.name} width={50} height={50} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Balance: {coin.balance}</p>
                  <p>Price: ${coin.price}</p>
                  <Progress value={coin.trend} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
      <style jsx global>{`
        @keyframes hue {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }
        .animate-hue {
          animation: hue 10s infinite linear;
        }
      `}</style>
    </div>
  );
}
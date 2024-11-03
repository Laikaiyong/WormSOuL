"use client";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="px-4 lg:px-10">
        <header className="flex justify-between">
          <div className="h-[50px] w-[50px] lg:w-[100px] lg:h-[80px] relative">
            <Image
              src=""
              alt="WormSoul logo"
              objectFit="contain"
              className="object-contain"
            /> 
          </div>
          <button>
            Connect Wallet
          </button>
        </header>
        <section>
          
        </section>
      </main>
    </>
  )
}
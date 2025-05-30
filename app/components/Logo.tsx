"use client"

import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image 
        src="/whether-io.png" 
        alt="weather.io logo" 
        width={32} 
        height={32} 
        className="object-contain"
      />
      <span className="text-lg font-semibold text-primary">whether.io</span>
    </div>
  )
}

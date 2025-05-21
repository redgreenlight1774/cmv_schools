"use client"

import type { ReactNode } from "react"

interface IPhoneWrapperProps {
  children: ReactNode
}

export default function IPhoneWrapper({ children }: IPhoneWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative mx-auto">
        {/* iPhone Outline */}
        <div className="relative w-[320px] h-[650px] rounded-[40px] overflow-hidden border border-gray-400 shadow-xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[14px] z-10"></div>

          {/* Content */}
          <div className="w-full h-full overflow-y-auto p-[15px] bg-gradient-to-b from-blue-500 to-teal-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

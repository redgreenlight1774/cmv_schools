"use client"

import { useState, useRef, type KeyboardEvent, type ChangeEvent, useEffect } from "react"
import IPhoneWrapper from "./iphone-wrapper"
import { EyeOff, ChevronDown } from "lucide-react"

export default function AppWithIPhoneOutline() {
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pin, setPin] = useState<string[]>(["", "", ""])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Refs for PIN input fields
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  // Available roles
  const roles = ["Administration", "Owner", "Instructor", "Student"]

  const handleModeSwitch = (mode: "login" | "signup") => {
    if (isAnimating) return

    if ((mode === "login" && !isLoginMode) || (mode === "signup" && isLoginMode)) {
      setIsAnimating(true)

      // Start animation - content disappears (faster now - 150ms)
      setTimeout(() => {
        // Reset PIN and dropdown when switching modes
        setPin(["", "", ""])
        setSelectedRole("")

        setIsLoginMode(mode === "login")

        // Content comes back (faster now - 150ms)
        setTimeout(() => {
          setIsAnimating(false)
        }, 150)
      }, 150)
    }
  }

  // Handle PIN input change
  const handlePinChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Only allow single digit numbers
    if (value && !/^\d$/.test(value)) return

    // Update PIN state
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input if a digit was entered
    if (value && index < 2) {
      pinRefs[index + 1].current?.focus()
    }
  }

  // Handle keydown for backspace navigation
  const handlePinKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // If backspace is pressed and current input is empty, focus previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus()
    }
  }

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <IPhoneWrapper>
      <div className="flex flex-col h-full">
        {/* Back Button */}
        <div className="p-2">
          <button className="text-black text-xl">&lt;</button>
        </div>

        {/* Logo - Made smaller */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 relative">
            <div className="absolute transform rotate-45 w-full h-full bg-yellow-400 border-2 border-black"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-black font-bold text-lg">CDL</div>
                <div className="text-black font-bold text-lg">SCHOOLS</div>
                <div className="flex justify-center mt-1">
                  <div className="w-5 h-5 bg-blue-600 rounded-full mr-1 relative">
                    {/* Plus sign with 100% black */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-[2px] bg-black"></div>
                      <div className="h-3 w-[2px] bg-black absolute"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State Name - Brought closer to the card */}
        <div className="pl-5 mb-1">
          <h2 className="text-black font-medium text-[17px] mb-[3px]">State Name</h2>
        </div>

        {/* Form Card - Added box shadow with specified coordinates and min-height to maintain size */}
        <div className="bg-white rounded-[11px] p-[12px] mb-[15px] shadow-[10px_0px_15px_4px_rgba(0,0,0,0.25)] min-h-[440px]">
          <div
            className={`transition-opacity duration-150 ease-in-out flex flex-col h-full ${isAnimating ? "opacity-0" : "opacity-100"}`}
          >
            <div className="mb-3">
              <h1 className="text-2xl font-bold mb-1">{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
              <p className="text-gray-600 text-sm">Please select role and enter the PIN.</p>
            </div>

            {/* Role Selector Dropdown */}
            <div className="mb-3 flex justify-center">
              <div ref={dropdownRef} className="relative w-[140px]">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-[35px] border border-blue-500 rounded-lg flex justify-between items-center px-2 bg-white"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="text-gray-700 text-sm truncate">{selectedRole || "Select Role"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <ul role="listbox" className="py-1">
                      {roles.map((role) => (
                        <li
                          key={role}
                          role="option"
                          aria-selected={selectedRole === role}
                          onClick={() => handleRoleSelect(role)}
                          className={`px-2 py-1.5 text-sm hover:bg-blue-50 cursor-pointer ${
                            selectedRole === role ? "bg-blue-50 font-medium" : ""
                          }`}
                        >
                          {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* PIN Buttons - Now interactive inputs */}
            <div className="flex justify-center gap-6 mb-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center relative"
                >
                  <input
                    ref={pinRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[index]}
                    onChange={(e) => handlePinChange(index, e)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="absolute inset-0 w-full h-full bg-transparent text-center text-lg font-bold focus:outline-none"
                    aria-label={`PIN digit ${index + 1}`}
                  />
                  {!pin[index] && <div className="w-3 h-3 bg-gray-400 rounded-full pointer-events-none"></div>}
                </div>
              ))}
            </div>

            {/* Email Field */}
            <div className="mb-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>

            {/* Password Field - Increased icon stroke width */}
            <div className="mb-2 relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <EyeOff className="w-4 h-4 text-gray-500" strokeWidth={2} />
              </button>
            </div>

            {/* Confirm Password Field or Placeholder to maintain height */}
            {!isLoginMode ? (
              <div className="mb-0.5 relative">
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <EyeOff className="w-4 h-4 text-gray-500" strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div className="h-[42px] mb-0.5"></div> /* Placeholder div to maintain height */
            )}

            {/* Button - Changes text based on mode */}
            <div className="w-full flex justify-center mt-0">
              <button
                type="submit"
                className="w-[60%] h-[40px] text-[20px] text-white rounded-[24px] border-[1.2px] border-white bg-[#4B39EF] shadow-sm"
              >
                {isLoginMode ? "Log In" : "SignUp"}
              </button>
            </div>

            {/* Spacer to push tab buttons down */}
            <div className="flex-grow"></div>

            {/* Tab Buttons - Positioned at bottom of card */}
            <div className="flex rounded-[11px] overflow-hidden border-[1.2px] border-gray-300 shadow-md mt-auto">
              <button
                className={`flex-1 py-2 text-sm font-medium ${!isLoginMode ? "bg-white text-black" : "bg-gray-500 text-white"}`}
                onClick={() => handleModeSwitch("signup")}
              >
                Create Account
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${isLoginMode ? "bg-white text-black" : "bg-gray-500 text-white"}`}
                onClick={() => handleModeSwitch("login")}
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Gradient background visible at bottom */}
        <div className="flex-grow"></div>
      </div>
    </IPhoneWrapper>
  )
}

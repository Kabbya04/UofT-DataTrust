// civic-data-trust/app/components/dashboard/top-nav.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Profile from "./profile";
import { NotificationButton } from './notification-button'; // <-- IMPORT the new component

// This is the four-dot logo from your reference image
const LogoElement = () => (
  <div className="relative w-5 h-5 flex items-center justify-center">
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
  </div>
);

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Effect to change the navbar shape on mobile when the menu opens
  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }
    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300); // Wait for the collapse animation before changing back to a pill
    }
    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // We group your action items to reuse them on desktop and mobile
  const ActionItems = () => (
    <>
      {/* --- The old button is replaced with the new component --- */}
      <NotificationButton />

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Image
            src="/profile.jpg"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-gray-200/50 dark:ring-white/20 sm:w-8 sm:h-8 cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="w-[280px] sm:w-80 border-border/50 bg-card/80 backdrop-blur-md"
        >
          <Profile avatar="/profile.jpg" />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       pl-4 pr-3 py-2
                       ${headerShapeClass}
                       border border-border/20 bg-card/60 backdrop-blur-lg
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-all duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full sm:gap-x-6">
        <Link href="/dashboard" aria-label="Go to Homepage">
          <LogoElement />
        </Link>
        
        <nav className="hidden sm:flex">
          <span className="text-sm text-foreground/80 text-mono-caps">WELCOME TO THE DASHBOARD</span>
        </nav>

        {/* Desktop action items */}
        <div className="hidden sm:flex items-center gap-2">
          <ActionItems />
        </div>

        {/* Mobile menu button */}
        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-foreground focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      {/* Mobile expandable menu */}
      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-48 opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <div className="flex items-center space-x-4">
          <ActionItems />
        </div>
      </div>
    </header>
  );
}
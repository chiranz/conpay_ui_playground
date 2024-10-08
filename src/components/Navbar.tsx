"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Plus, List, Shield, User, Menu, X } from "lucide-react";
import { ethers } from "ethers";

interface NavbarProps {
  isConnected: boolean;
  onConnect: () => Promise<void>;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isConnected, onConnect, onNavigate }) => {
  const pathname = usePathname(); // Ensure this hook is correctly used
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []); // Ensure this effect runs only once on mount

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="shadow-md bg-slate-800 bg-opacity-90 backdrop-filter backdrop-blur-lg">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-xl font-bold transition-colors duration-300 text-sky-400 hover:text-sky-300"
          >
            <Shield className="mr-2" size={24} />
            <span className="hidden sm:inline">Web3 Escrow</span>
          </Link>
          <div className="items-center hidden space-x-4 md:flex">
            <NavLink href="/" icon={<Home size={20} />} text="Home" currentPath={pathname || ''} />
            <NavLink href="/create" icon={<Plus size={20} />} text="Create Escrow" currentPath={pathname || ''} />
            <NavLink
              href={`/escrows/${walletAddress || ""}`}
              icon={<List size={20} />}
              text="My Escrows"
              currentPath={pathname || ''}
            />
            {walletAddress && (
              <NavLink
                href={`/profile/${walletAddress}`}
                icon={<User size={20} />}
                text="Profile"
                currentPath={pathname || ''}
              />
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="transition-colors duration-300 text-slate-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/" icon={<Home size={20} />} text="Home" currentPath={pathname || ''} onClick={toggleMenu} />
            <MobileNavLink
              href="/create"
              icon={<Plus size={20} />}
              text="Create Escrow"
              currentPath={pathname || ''}
              onClick={toggleMenu}
            />
            <MobileNavLink
              href={`/escrows/${walletAddress || ""}`}
              icon={<List size={20} />}
              text="My Escrows"
              currentPath={pathname || ''}
              onClick={toggleMenu}
            />
            {walletAddress && (
              <MobileNavLink
                href={`/profile/${walletAddress}`}
                icon={<User size={20} />}
                text="Profile"
                currentPath={pathname || ''}
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text, currentPath }) => (
  <Link
    href={href}
    className={`flex items-center text-slate-300 hover:text-sky-400 transition-colors duration-300 ${
      currentPath === href ? "text-sky-400" : ""
    }`}
  >
    {icon}
    <span className="hidden ml-1 sm:inline">{text}</span>
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, icon, text, currentPath, onClick }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
      currentPath === href ? "text-white bg-slate-900" : "text-slate-300 hover:text-white hover:bg-slate-700"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  </Link>
);

export default Navbar;

"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";

const NavbarWrapper: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    // Implement connection logic here
    setIsConnected(true);
  };

  const handleNavigate = (page: string) => {
    // Implement navigation logic here if needed
    console.log(`Navigating to ${page}`);
  };

  return <Navbar isConnected={isConnected} onConnect={handleConnect} onNavigate={handleNavigate} />;
};

export default NavbarWrapper;

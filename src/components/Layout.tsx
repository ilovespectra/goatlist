import { FC, ReactNode, useState } from "react";
import pkg from '../../package.json';
import { Heading } from "./Heading";
import { useWallet } from '@solana/wallet-adapter-react';
import Home from './Home';
import Goatlist from "./Join";
import ViewEntries from "./Goatlist";// Import the ViewEntries component
import LandingModal from "./LandingModal";

export const Layout: FC = ({ children }) => {
  const { publicKey } = useWallet();

  // State variable to track which component to display
  const [activeComponent, setActiveComponent] = useState<'home' | 'goatlist' | 'join' | 'none'>('none'); // Add 'none' as a default value

  const handleComponentChange = (component: 'home' | 'goatlist' | 'join' | 'none') => {
    setActiveComponent(component);
  };

  return (
    
    <div className="md:hero mx-auto p-4">
      
      <div className="md:hero-content flex flex-col">
      <LandingModal />
        <div className="text-center">
        <div className="md:w-full text-center my-2">
          <img src="/solologo.png" alt="Island DAO Goatlist" />
        </div>
          {/* Display the buttons */}
          <button onClick={() => handleComponentChange('join')} className="group w-30 m-2 btn disabled:animate-none lowercase">add a kri kri</button>
          <button onClick={() => handleComponentChange('goatlist')} className="group w-30 m-2 btn disabled:animate-none lowercase">view the goatlist</button>
          
          {publicKey ? ( // Check if wallet is connected
            <>
              {activeComponent === 'join' && <Goatlist />}
              {activeComponent === 'goatlist' && <ViewEntries />}
            </>
          ) : (
            <p>connect a wallet to interact</p> // Display message if wallet is not connected
          )}
        </div>
      </div>
    </div>
  );
}

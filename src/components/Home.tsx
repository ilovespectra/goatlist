import React, { useEffect } from 'react';
import LandingModal from './LandingModal';

const Home: React.FC = () => {
  useEffect(() => {
    const modal = document.getElementById('modal-root');
    if (modal) {
      modal.style.display = 'block';
    }
  }, []);

  return (
    <div>
      {/* Your home page content goes here */}
      <LandingModal />
    </div>
  );
};

export default Home;

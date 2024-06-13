import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    color: 'white',
    padding: '20px',
    width: '50vh',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
};

const LandingModal: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Disable scrolling when the modal is open
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      contentLabel="Island DAO Goatlist Modal"
      style={customStyles}
    >
      <h1>Island DAO Goatlist</h1>
      <p className="mb-2">Created by tanny.sol</p>
      <hr />
      <p className="mt-2"><strong>What it does:</strong></p>
      <p className="mt-5">Add your Twitter and a nickname, pubkey logged to Firebase. (Works on Devnet)</p>
      <p className="mt-5">Follow your fellow kri kri, save the wallet list for airdrops, goodies, etc.</p>
      <button className="mt-5 border border-white rounded-md p-2" onClick={closeModal}>Got it!</button>
    </Modal>
  );
};

export default LandingModal;

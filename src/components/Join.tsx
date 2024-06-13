import React, { useState, FormEvent, useEffect } from 'react';
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase if not already initialized
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  app = getApp(); // If Firebase app is already initialized, get it
}
const db = getFirestore(app);

const Goatlist: React.FC = () => {
    const [isSuccessMessageVisible, setSuccessMessageVisible] = useState(false); // New state for success message
    const [formData, setFormData] = useState({
      twitterHandle: '',
      nickname: '',
      image: '',
    });

  const { publicKey } = useWallet();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { twitterHandle, nickname, image } = formData;
  
    console.log('Form data:', formData); // Log form data to check if it's populated correctly
  
    try {
      // Add user document
      const userDocRef = await addDoc(collection(db, 'users'), { // Changed collection name to 'users'
        twitterHandle,
        nickname,
        pubkey: publicKey.toBase58(), // Use pubkey from useWallet
        image,
      });
  
      console.log('User document added with ID:', userDocRef.id); // Log the ID of the added user document
  
      await addDoc(collection(db, 'User Entries'), {
        user: userDocRef.id, // Reference to user document
        timestamp: serverTimestamp(),
      });
  
      console.log('kri kri added successfully');
      setFormData({
        twitterHandle: '',
        nickname: '',
        image: '',
      });
      setSuccessMessageVisible(true); // Show the success message
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} id="FreewriteEntryForm">
        <div>
          <label className="input-label" htmlFor="twitterHandle">
            Twitter Handle:
          </label><br />
          <input
            type="text"
            id="twitterHandle"
            className="text-input"
            required
            name="twitterHandle"
            value={formData.twitterHandle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="input-label" htmlFor="nickname">
            Nickname:
          </label><br />
          <input
            type="text"
            id="nickname"
            className="text-input"
            required
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="input-label" htmlFor="image">
            Image URL:
          </label><br />
          <input
            type="text"
            id="image"
            className="text-input"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <button className="btn lowercase" type="submit">
          submit
        </button>
      </form>
      {/* Success message */}
      {isSuccessMessageVisible && (
        <p><i>a goat has been added to the list!</i></p>
      )}
    </div>
  );
};

export default Goatlist;

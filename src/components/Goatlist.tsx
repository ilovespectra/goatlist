import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Image from 'next/image';

function ViewEntries() {
    const [entryList, setEntryList] = useState([]);
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

    const fetchAndDisplayEntries = () => {
        const users = [];
        
        const usersCollection = collection(db, 'users'); // Changed collection name to 'users'
        
        getDocs(usersCollection)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    users.push(userData);
                });
                
                setEntryList(users);
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    };

    useEffect(() => {
        fetchAndDisplayEntries();
    }, []); // Fetch and display entries when component mounts

    const handleDownloadPubkeys = () => {
    // Use a Set to store unique pubkeys
    const uniquePubkeys = new Set();
    entryList.forEach(entry => {
        uniquePubkeys.add(entry.pubkey);
    });
    
    // Convert the Set to an array and join pubkeys
    const pubkeys = [...uniquePubkeys].join(', ');
    
    // Create Blob with unique pubkeys
    const blob = new Blob([pubkeys], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'goatlist.txt');
};


    return (
        <div className="container">
            <button className="border border-gray rounded-lg py-2 px-4 mt-3 mb-3 hover:scale-105" onClick={handleDownloadPubkeys}>
            save wallet list
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {entryList.map((entry, index) => (
                    <a
                        key={index}
                        href={`https://x.com/${entry.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        style={{ textDecoration: 'none' }}
                    >
                        <div style={{ textAlign: 'center', backgroundColor: 'transparent', border: '2px solid gray', borderRadius: '10px', padding: '10px', transition: 'transform 0.2s', cursor: 'pointer' }} 
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img src={entry.image} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'block', margin: '0 auto' }} />
                            <p style={{ color: 'white', fontSize: 'clamp(10px, 3vw, 20px)', overflowWrap: 'break-word' }}>
                            <strong>{entry.twitterHandle}</strong>
                            </p>
                            <p style={{ color: 'white' }}>{entry.nickname}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default ViewEntries;

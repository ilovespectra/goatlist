import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaTimes } from 'react-icons/fa'; // Install react-icons if you haven't already
import 'tailwindcss/tailwind.css'; // Assuming you're using Tailwind CSS

function ViewEntries() {
    const [entryList, setEntryList] = useState<DocumentData[]>([]);
    const { publicKey } = useWallet();

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
        const users: DocumentData[] = [];
        const usersCollection = collection(db, 'users'); // Changed collection name to 'users'
        
        getDocs(usersCollection)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    users.push({ id: doc.id, ...userData });
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
        const uniquePubkeys = new Set(entryList.map(entry => entry.pubkey));
        const pubkeys = [...uniquePubkeys].join(', ');
        const blob = new Blob([pubkeys], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'goatlist.txt');
    };

    const handleDeleteEntry = async (id: string) => {
        await deleteDoc(doc(db, 'users', id));
        fetchAndDisplayEntries();
    };

    return (
        <div className="container">
            <button className="border border-gray rounded-lg py-2 px-4 mt-3 mb-3 hover:scale-105" onClick={handleDownloadPubkeys}>
                save wallet list
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {entryList.map((entry, index) => (
                    <div key={index} className="relative bg-transparent border-2 border-gray-500 rounded-lg p-4 transition-transform transform hover:scale-105">
                        {publicKey?.toBase58() === entry.pubkey && (
                            <button 
                                onClick={() => handleDeleteEntry(entry.id)} 
                                className="absolute top-2 right-2 text-red-500"
                            >
                                <FaTimes />
                            </button>
                        )}
                        <a
                            href={`https://x.com/${entry.twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-center"
                        >
                            <img src={entry.image} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
                            <p className="text-white text-lg overflow-wrap break-word">
                                <strong>{entry.twitterHandle}</strong>
                            </p>
                            <p className="text-white">{entry.nickname}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewEntries;

import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

type DocumentData = any;

function ViewEntries() {
    const [entryList, setEntryList] = useState<DocumentData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newImageUrl, setNewImageUrl] = useState<string>('');
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

    let app: FirebaseApp;
    try {
        app = initializeApp(firebaseConfig);
    } catch (error) {
        app = getApp();
    }

    const db = getFirestore(app);

    const fetchAndDisplayEntries = () => {
        const users: DocumentData[] = [];
        const usersCollection = collection(db, 'users');
        
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
    }, []);

    const handleDeleteEntry = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const userDoc = doc(db, 'users', id);
            try {
                await deleteDoc(userDoc);
                setEntryList(entryList.filter(entry => entry.id !== id));
            } catch (error) {
                console.error('Error deleting document: ', error);
            }
        }
    };

    const handleUpdateEntry = async (id: string) => {
        const userDoc = doc(db, 'users', id);
        try {
            await updateDoc(userDoc, { image: newImageUrl });
            setEntryList(entryList.map(entry => (entry.id === id ? { ...entry, image: newImageUrl } : entry)));
            setEditingId(null);
            setNewImageUrl('');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleDownloadPubkeys = () => {
        const uniquePubkeys = new Set<string>();
        entryList.forEach(entry => uniquePubkeys.add(entry.pubkey));
        const pubkeys = [...uniquePubkeys].join(', ');
        const blob = new Blob([pubkeys], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'goatlist.txt');
    };

    return (
        <div className="container">
            <button 
                className="border border-gray rounded-lg py-2 px-4 mt-3 mb-3 hover:scale-105" 
                onClick={handleDownloadPubkeys}
            >
                save wallet list
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
                {entryList.map((entry) => (
                    <div key={entry.id} className="text-center bg-transparent border-2 border-gray rounded-lg p-4 transition-transform transform hover:scale-105">
                        {editingId === entry.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={newImageUrl} 
                                    onChange={(e) => setNewImageUrl(e.target.value)} 
                                    placeholder="img url" 
                                    className="mt-2 p-2 rounded-lg border-2 border-gray-300 w-full bg-black text-white" 
                                />
                                <button 
                                    onClick={() => handleUpdateEntry(entry.id)} 
                                    className="mt-2 p-2 bg-purple-500 hover:bg-purple-800 text-white rounded-lg w-full flex justify-center items-center"
                                >
                                    <FaSave className="mr-2" /> save
                                </button>
                                <button 
                                    onClick={() => {
                                        setEditingId(null);
                                        setNewImageUrl('');
                                    }} 
                                    className="mt-2 p-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg w-full flex justify-center items-center"
                                >
                                    <FaTimes className="mr-2" /> cancel
                                </button>
                            </>
                        ) : (
                            <>
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
                                {publicKey && publicKey.toString() === entry.pubkey && (
                                    <div className="flex justify-between mt-2">
                                        <FaEdit 
                                            onClick={() => setEditingId(entry.id)} 
                                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                                        />
                                        <FaTrash 
                                            onClick={() => handleDeleteEntry(entry.id)} 
                                            className="cursor-pointer text-purple-600 hover:text-purple-800"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewEntries;

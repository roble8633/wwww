import { initializeApp } from '@firebase/app';
import { getDatabase } from '@firebase/database';
import { getAuth } from '@firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBIDWB4ErYHOAi8EjnGsFH3tiODhTequiM",
    authDomain: "music-player-d6ada.firebaseapp.com",
    projectId: "music-player-d6ada",
    storageBucket: "music-player-d6ada.firebasestorage.app",
    messagingSenderId: "1056621305719",
    appId: "1:1056621305719:web:70c000167e3b9b6571cb72",
    measurementId: "G-H5HQ1PXB0W"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app); 
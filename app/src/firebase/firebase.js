import { initializeApp } from "firebase/app"; 
import { getStorage, connectStorageEmulator } from "firebase/storage";

// La tua configurazione Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Configura Firebase Storage
const storage = getStorage(app);
if (window.location.hostname === "localhost") {
    // Connetti l'emulatore di Firebase Storage alla porta 9199
    connectStorageEmulator(storage, "localhost", 9199);
}

// Esporta app e storage
export { app, storage };
export default app;

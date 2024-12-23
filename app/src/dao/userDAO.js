// Importa i metodi necessari da Firebase Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import {storage,app} from "@/firebase/firebase";
// Inizializza Firestore
const db = getFirestore();
const auth = getAuth();


//DAO per l'utente e le varie funzionalità



/**
 * Ottiene l'UID dell'utente attualmente autenticato.
 * @returns {Promise<string>} - Restituisce l'UID dell'utente.
 * @throws {Error} - Solleva un errore se l'utente non è autenticato.
 */
export async function getCurrentUserUID() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); // Restituisce l'UID se l'utente è autenticato
      } else {
        reject(new Error("Nessun utente autenticato."));
      }
    });
  });
}


/**
 * Recupera i dati di un utente dato il suo ID.
 * @param {string} userId - L'ID dell'utente da cercare.
 * @returns {Promise<Object>} - Un oggetto con i dati dell'utente se trovato.
 * @throws {Error} - Solleva un errore se il documento non esiste.
 */
export async function getUserByID(userId) {
  try {
    // Riferimento al documento
    const docRef = doc(db, "utenti", userId);
    
    // Recupera i dati del documento
    const utente = await getDoc(docRef);

    // Controlla se il documento esiste
    if (utente.exists()) {
      return utente.data(); // Restituisce i dati come oggetto
    } else {
      throw new Error("Utente non trovato!");
    }
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw error; // Propaga l'errore al chiamante
  }
}

// Importa i metodi necessari da Firebase Firestore
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import app from "../firebase/firebase"; // Assicurati che il percorso sia corretto

// Inizializza Firestore
const db = getFirestore(app);

/**
 * Recupera la lista di tutti i mentori basandosi sul campo `field` del mentee confrontandolo con `occupazione` del mentor.
 * @param {string} menteeField - Il campo di interesse del mentee.
 * @returns {Promise<Array>} - Restituisce un array di oggetti con i dati dei mentori.
 * @throws {Error} - Solleva un errore se il recupero fallisce.
 */
export async function getAllMentors(menteeField) {
  try {
    console.log("Recupero mentori basati sul campo di interesse del mentee...");

    // Verifica che il valore di menteeField sia definito
    if (!menteeField) {
      throw new Error("Il campo di interesse del mentee non è definito.");
    }

    // Query per trovare mentori il cui campo `occupazione` corrisponde al `field` del mentee
    const mentorsQuery = query(
      collection(db, "utenti"),
      where("userType", "==", "mentor"), // Filtro per i mentori
      where("occupazione", "==", menteeField) // Confronta `occupazione` del mentor con `field` del mentee
    );

    // Esegui la query
    const querySnapshot = await getDocs(mentorsQuery);

    // Verifica se la query restituisce risultati
    if (querySnapshot.empty) {
      console.warn("Nessun mentore trovato per il campo di interesse:", menteeField);
      return [];
    }

    // Mappa i risultati della query in un array di oggetti
    const mentors = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Includi l'ID del documento
    }));

    console.log("Mentori recuperati:", mentors);
    return mentors;
  } catch (error) {
    console.error("Errore durante il recupero dei mentori:", error);
    throw new Error("Non è stato possibile recuperare i mentori.");
  }
}

// Importa i metodi necessari da Firebase Firestore
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import app from "../firebase/firebase"; // Assicurati che il percorso sia corretto

// Inizializza Firestore
const db = getFirestore(app);

/**
 * Recupera la lista di tutti i mentori.
 * @returns {Promise<Array>} - Restituisce un array di oggetti con i dati dei mentori.
 * @throws {Error} - Solleva un errore se il recupero fallisce.
 */
export async function getAllMentors(userInterest) {
    try {
      console.log("Recupero mentori..."); // Log per debug
  
      // Verifica che il valore di userInterest sia definito
      if (!userInterest) {
        throw new Error("Il campo di interesse dell'utente non è definito.");
      }
  
      const mentorsQuery = query(
        collection(db, "utenti"),
        where("userType", "==", "mentor"),
        where("sector", "==", userInterest) // Filtro basato sul CampoInteresse
      );
  
      const querySnapshot = await getDocs(mentorsQuery);
  
      if (querySnapshot.empty) {
        console.warn("Nessun mentore trovato."); // Log per debug
        return [];
      }
  
      const mentors = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
  
      console.log("Mentori recuperati:", mentors); // Log per debug
      return mentors;
    } catch (error) {
      console.error("Errore durante il recupero dei mentori:", error);
      throw new Error("Non è stato possibile recuperare i mentori.");
    }
  }
  

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
      console.log("Recupero mentori per il campo mentee:", menteeField);
  
      const mentorsQuery = query(
        collection(db, "utenti"),
        where("userType", "==", "mentor"),
        where("occupazione", "==", menteeField)
      );
  
      const querySnapshot = await getDocs(mentorsQuery);
  
      if (querySnapshot.empty) {
        console.warn("Nessun mentore trovato per il campo:", menteeField);
        return [];
      }
  
      // Log dettagliato per ciascun documento
      const mentors = querySnapshot.docs.map((doc) => {
        console.log("Documento trovato:", doc.id, doc.data());
        return { ...doc.data(), id: doc.id };
      });
  
      console.log("Tutti i mentori trovati:", mentors);
      return mentors;
    } catch (error) {
      console.error("Errore durante il recupero dei mentori:", error);
      throw new Error("Non è stato possibile recuperare i mentori.");
    }
  }
  

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Recupera i mentori dal database in base ai criteri specificati.
 * @param {Object} filters - I filtri per la ricerca.
 * @param {string} filters.occupation - L'occupazione del mentore.
 * @param {number} filters.availability - Disponibilità minima in ore.
 * @param {string} filters.meetingMode - Modalità di incontro preferita.
 * @returns {Promise<Array>} - Un array di mentori.
 */
export async function getMentors({ occupation, availability, meetingMode }) {
  const db = getFirestore();

  try {
    const mentorsRef = collection(db, "utenti");
    let q = query(mentorsRef); // Inizia con una query vuota

    // Applica filtri dinamici
    if (occupation) q = query(q, where("occupazione", "==", occupation));
    if (availability) q = query(q, where("availability", ">=", availability));
    if (meetingMode) q = query(q, where("meetingMode", "==", meetingMode));

    // Esegui la query
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Errore durante la ricerca dei mentori:", err);
    throw new Error("Errore durante la ricerca.");
  }
}

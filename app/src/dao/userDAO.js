//### DAO per l'utente

// Importa i metodi necessari da Firebase Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc} from "firebase/firestore";
import { updateCV } from "@/auth/user-registration";

// Inizializza Firestore
const db = getFirestore();
const auth = getAuth();


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
 * Aggiorna il profilo dell'utente in Firestore con i dati forniti.
 * 
 * @param {string} uid - L'ID dell'utente da aggiornare.
 * @param {Object} profileData - I dati da aggiornare nel profilo dell'utente (es. nome, cognome, ecc.).
 * @returns {Promise<Object>} - Un oggetto che indica il successo o il fallimento dell'operazione. 
 *                               Ritorna `{ success: true }` se l'aggiornamento è riuscito, altrimenti `{ success: false, error: string }` con il messaggio di errore.
 * @throws {Error} - Solleva un errore se l'aggiornamento del profilo non riesce.
 */
export async function updateUserProfile(uid, profileData) {
  try {
    // Espressioni regolari per validare i campi
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']{1,100}$/;
    const surnameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']{1,100}$/;

    // Validazione dei campi
    if (profileData.nome && !nameRegex.test(profileData.nome)) {
      throw new Error("Il campo 'Nome' non è valido. Assicurati che rispetti i criteri.");
    }

    if (profileData.cognome && !surnameRegex.test(profileData.cognome)) {
      throw new Error("Il campo 'Cognome' non è valido. Assicurati che rispetti i criteri.");
    }

    // Riferimento al documento dell'utente nella collezione 'utenti' in Firestore
    const userDocRef = doc(db, 'utenti', uid);

    // Aggiornamento del documento con i nuovi dati passati come 'profileData'
    await updateDoc(userDocRef, profileData);

    console.log('Profilo aggiornato con successo!');

    // Ritorna un oggetto di successo
    return { success: true };
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo:", error);
    // Ritorna un oggetto di errore
    return { success: false, error: error.message };
  }
}

/**
 * Aggiorna il profilo dell'utente insieme al caricamento del CV (se presente).
 * 
 * @param {string} userId - L'ID dell'utente da aggiornare.
 * @param {Object} formData - I dati del modulo, inclusi i dati del profilo e del CV.
 * @returns {Promise<Object>} - Un oggetto che indica il successo o il fallimento dell'operazione.
 *                               Ritorna `{ success: true }` se l'aggiornamento è riuscito, altrimenti `{ success: false, error: string }` con il messaggio di errore.
 * @throws {Error} - Solleva un errore se l'aggiornamento del profilo o del CV non riesce.
 */
export async function updateUserProfileWithCV(userId, formData) {
  try {
    // Crea un oggetto con i dati da aggiornare
    const updatedData = {
      meetingMode: formData.meetingMode || null,
      availability: formData.availability || null,
      impiego: formData.impiego || null,
      portfolioProjects: formData.portfolioProjects,  // Progetti nel portfolio dell'utente
      nome: formData.nome,                            // Nome dell'utente
      cognome: formData.cognome,                      // Cognome dell'utente
      sesso: formData.genere,                         // Genere dell'utente
      titoloDiStudio: formData.titoloDiStudio,        // Titolo di studio dell'utente
      competenze: formData.competenze,                // Elenco delle competenze dell'utente
      occupazione: formData.occupazione,              // Occupazione dell'utente
      field: formData.field || "",                    // Area di specializzazione (opzionale)
      updatedAt: new Date().toISOString(),            // Timestamp dell'ultimo aggiornamento
    };

    console.log("[updateUserProfileWithCV] sto per inviare questi dati: {updatedData}");
    console.dir(updatedData);

    // Se l'utente ha caricato un nuovo CV, aggiorna il CV tramite la funzione 'updateCV'
    let cvURL = formData.cv ? await updateCV(formData.cv, userId, formData.oldCvURL) : formData.oldCvURL;

    // Aggiungi l'URL del CV aggiornato ai dati
    if (cvURL) {
      updatedData.cv = cvURL;
    }

    // Aggiorna i dati dell'utente in Firestore
    const updateResult = await updateUserProfile(userId, updatedData);

    if (updateResult.success) {
      console.log("Profilo e CV aggiornati con successo!");
      return { success: true };
    } else {
      return { success: false, error: updateResult.error };
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo completo:", error.message);
    return { success: false, error: error.message };
  }
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
      return { id: userId, ...utente.data() }; // Aggiunge l'ID all'oggetto dati
    } else {
      throw new Error("Utente non trovato!");
    }
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw error; // Propaga l'errore al chiamante
  }
}

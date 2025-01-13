// contenutiDAO.js
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../firebase/firebase"; // Assicurati che il percorso sia corretto

// Inizializza Firestore e Storage
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Carica un documento su Firebase Storage e aggiunge i suoi metadati a Firestore.
 * @param {Object} data - I dati del documento.
 * @param {File} file - Il file da caricare.
 * @returns {Promise<Object>} - Ritorna l'oggetto documento aggiunto.
 * @throws {Error} - Solleva un errore in caso di fallimento.
 */
export async function uploadDocument(data, file) {
  try {
    console.log("Tentativo di caricamento del file:", file.name);

    const fileRef = ref(storage, `documents/${file.name}`);
    await uploadBytes(fileRef, file);
    console.log("File caricato con successo su Firebase Storage");

    const fileUrl = await getDownloadURL(fileRef);
    console.log("URL generato per il file:", fileUrl);

    const documentData = {
      ...data,
      filePath: fileUrl,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "documents"), documentData);
    console.log("Documento aggiunto a Firestore con ID:", docRef.id);

    return { ...documentData, id: docRef.id };
  } catch (error) {
    console.error("Errore durante il caricamento del file o il salvataggio:", error);
    throw new Error("Errore durante il caricamento del documento.");
  }
}

/**
 * Recupera tutti i documenti dalla collezione "documents" in Firestore.
 * @returns {Promise<Array>} - Restituisce un array di documenti.
 * @throws {Error} - Solleva un errore in caso di fallimento.
 */
export async function getAllDocuments() {
  try {
    const querySnapshot = await getDocs(collection(db, "documents"));
    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log("Documenti recuperati:", documents);
    return documents;
  } catch (error) {
    console.error("Errore durante il recupero dei documenti:", error);
    throw new Error("Errore durante il recupero dei documenti.");
  }
}

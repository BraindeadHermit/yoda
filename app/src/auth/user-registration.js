import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { storage } from "@/firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import app from "@/firebase/firebase";

// Funzione per caricare il CV su Firebase Storage
export async function uploadCV(file, userID) {
  try {
    const cvRef = ref(storage, `utenti/${userID}/cv/${file.name}`);

    // Carica il file nel percorso definito
    await uploadBytes(cvRef, file);
    
    // Ottieni l'URL del file caricato
    const cvURL = await getDownloadURL(cvRef);
    
    return cvURL; // Restituisce l'URL del file caricato
  } catch (error) {
    console.error("Errore durante il caricamento del CV:", error.message);
    throw new Error("Errore durante il caricamento del CV.");
  }
}


// Funzione per caricare o aggiornare il CV

export async function updateCV(file, userId) {
  try {
    const path = `utenti/${userId}/cv`;
    const filePath = path+`/${file.name}`;
    const cvRef = ref(storage, filePath);
    console.log(path);
    
    // Riferimento al percorso specificato
    const listRef = ref(storage, path);

    // Ottieni la lista dei file presenti nel percorso
    const res = await listAll(listRef);

    // Cancella ogni file nel percorso
    for (const itemRef of res.items) {
      await deleteObject(itemRef);
      console.log(`File eliminato: ${itemRef.fullPath}`);
    }    

    // Carica il nuovo CV nel percorso definito
    await uploadBytes(cvRef, file);

    // Ottieni l'URL del nuovo file caricato
    const cvURL = await getDownloadURL(cvRef);

    console.log("CV aggiornato con successo!");
    return cvURL; // Restituisce l'URL del nuovo CV
  } catch (error) {
    console.error("Errore durante il caricamento del CV:", error.message);
    throw new Error("Errore durante il caricamento del CV.");
  }
}


// Funzione di registrazione
export async function registerUser(formData, portfolioProjects) {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth(app);

    // Registra l'utente con email e password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // Ottieni l'UID dell'utente creato
    const userId = userCredential.user.uid;

    // Ottieni l'istanza di Firestore
    const db = getFirestore(app);

        // Carica il file CV se presente
    let cvURL = null;
    if (formData.cv) {
      cvURL = await uploadCV(formData.cv, userId); // Carica il CV e ottieni l'URL
    }

    // Crea un documento utente in Firestore
    const userData = {
      nome: formData.nome,
      cognome: formData.cognome,
      email: formData.email,
      sesso: formData.genere,
      dataNascita: formData.dataDiNascita,
      titoloDiStudio: formData.titoloDiStudio,
      competenze: formData.competenze,
      occupazione: formData.occupazione, // Aggiornato per accettare valori specifici come "developer", "web-developer", ecc.
      userType: formData.userType,
      portfolioProjects: portfolioProjects || [],
      cv: cvURL, // Salva il nome del file CV
      createdAt: new Date().toISOString(), // Aggiunto per tracciare la data di registrazione
      field: formData.field || "", // Aggiunto per gestire il campo di interesse sia per mentor che mentee
    };

    // Aggiungi proprietà specifiche per i mentor
    if (formData.userType === "mentor") {
      userData.impiego = formData.impiego,
      userData.availability = formData.availability || 0; // Disponibilità settimanale
      userData.meetingMode = formData.meetingMode || "online"; // Modalità di incontro
    }

    if (formData.userType === "mentee") {
      userData.field = formData.field || ""; // Campo di interesse del mentee
    }

    // Scrivi i dati utente su Firestore
    await setDoc(doc(db, "utenti", userId), userData);

    console.log("Utente registrato con successo!", userId);
    return { success: true, userId: userId };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.error("Errore: L'email è già registrata.");
      return { success: false, error: "L'email è già registrata." };
    } else {
      console.error("Errore durante la registrazione:", error.message);
      return { success: false, error: error.message };
    }
  }
}
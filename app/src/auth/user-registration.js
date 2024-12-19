import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Funzione di registrazione
async function registerUser(nome, cognome, email, password, sesso, dataNascita) {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth();

    // Registra l'utente con email e password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Ottieni l'UID dell'utente creato
    const userId = userCredential.user.uid;

    // Ottieni l'istanza di Firestore
    const db = getFirestore();

    // Crea un documento utente in Firestore
    await setDoc(doc(db, "utenti", userId), {
      nome: nome,
      cognome: cognome,
      email: email,
      sesso: sesso,
      dataNascita: dataNascita
    });

    console.log("Utente registrato con successo!", userId);
    return { success: true, userId: userId };
  } catch (error) {
    console.error("Errore durante la registrazione:", error.message);
    return { success: false, error: error.message };
  }
}
export { registerUser };
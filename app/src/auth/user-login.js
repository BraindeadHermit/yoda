import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Funzione di login
async function loginUser(email, password) {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth();

    // Effettua il login con email e password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Ottieni l'utente autenticato
    const user = userCredential.user;

    console.log("Login effettuato con successo!", user.uid);
    return { success: true, userId: user.uid, email: user.email };
  } catch (error) {
    console.error("Errore durante il login:", error.message);
    return { success: false, error: error.message };
  }
}

// Funzione di logout
async function logoutUser() {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth();

    // Effettua il logout
    await signOut(auth);

    console.log("Logout effettuato con successo!");
    return { success: true };
  } catch (error) {
    console.error("Errore durante il logout:", error.message);
    return { success: false, error: error.message };
  }
}

export { loginUser, logoutUser };

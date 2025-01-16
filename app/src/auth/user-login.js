import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "./auth-context";

/* 
    --| metodi Login e Logout importati da libreria Firebase

 */
// Funzione di login
async function loginUser(email, password) {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth();

    // Effettua il login con email e password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    console.log("Login effettuato con successo!", userCredential.uid);
    return { success: true, userId: userCredential.uid, email: userCredential.email };
  } catch (error) {
    console.error("Errore durante il login:", error.message);
    return { success: false, error: error.message };
  }
}

// Funzione di logout
async function logoutUser() {
  const {logout} = useAuth();
  logout();
}

export { loginUser, logoutUser };

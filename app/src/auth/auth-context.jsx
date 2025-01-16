import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Creazione del contesto di autenticazione
const AuthContext = createContext();

// Hook personalizzato per utilizzare il contesto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider per il contesto di autenticazione
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [nome, setNome] = useState(null);
  const [cognome, setCognome] = useState(null);
  const [field, setField] = useState(null); // Aggiunto il campo `field`
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "utenti", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserId(user.uid);
          setUserType(userData.userType);
          setIsLogged(true);
          setNome(userData.nome);
          setCognome(userData.cognome);
          setField(userData.field); // Aggiorna il valore di `field`

          // Persisti i dati nel localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({
              userId: user.uid,
              nome: userData.nome,
              cognome: userData.cognome,
              userType: userData.userType,
              isLogged: true,
              field: userData.field, // Aggiungi il campo `field`
            })
          );
        }
      } else {
        // Se l'utente non è autenticato, ripulisci lo stato
        setUserId(null);
        setUserType(null);
        setIsLogged(false);
        setNome(null);
        setCognome(null);
        setField(null); // Resetta anche il campo `field`
        localStorage.removeItem("auth");
      }
      setLoading(false);
    });

    // Carica i dati dal localStorage all'avvio
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { userId, userType, isLogged, nome, field } = JSON.parse(storedAuth);
      setUserId(userId);
      setUserType(userType);
      setIsLogged(isLogged);
      setNome(nome);
      setCognome(cognome);
      setField(field); // Recupera il campo `field` dal localStorage
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setUserId(null);
      setUserType(null);
      setIsLogged(false);
      setNome(null);
      setCognome(null);
      setField(null); // Resetta anche il campo `field`
      localStorage.removeItem("auth");
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userType,
        nome,
        cognome,
        field, // Aggiungi il campo `field` al contesto
        isLogged,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

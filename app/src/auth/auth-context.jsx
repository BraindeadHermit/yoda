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

          // Persisti i dati nel localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({
              userId: user.uid,
              name: user.nome,
              userType: userData.userType,
              isLogged: true,
            })
          );
        }
      } else {
        // Se l'utente non è autenticato, ripulisci lo stato
        setUserId(null);
        setUserType(null);
        setIsLogged(false);
        setNome(null);
        localStorage.removeItem("auth");
      }
      setLoading(false);
    });

    // Carica i dati dal localStorage all'avvio
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { userId, userType, isLogged, nome } = JSON.parse(storedAuth);
      setUserId(userId);
      setUserType(userType);
      setIsLogged(isLogged);
      setLoading(false);
      setNome(nome);
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
      localStorage.removeItem("auth");
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userType,
        nome,
        isLogged,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

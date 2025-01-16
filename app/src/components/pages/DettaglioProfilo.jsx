import { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth-context";
import { getUserByID } from "@/dao/userDAO";
import { DettagliUtente } from "./DettaglioUtente";

/* 
 */
export default function DettaglioProfilo() {
  const { userId } = useAuth(); // Recupera l'ID dell'utente autenticato
  const [userData, setUserData] = useState(null); // Stato per i dati dell'utente
  const [isLoading, setIsLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true); // Inizia il caricamento
        const data = await getUserByID(userId); // Ottieni i dati utente
        setUserData(data); // Salva i dati nello stato
      } catch (error) {
        alert("Errore durante il recupero dei dati utente:" +  error.message);
      } finally {
        setIsLoading(false); // Fine caricamento
      }
    };

    if (userId) {
      fetchUserData(); // Recupera i dati utente
    }
  }, [userId]); // Esegui l'effetto solo quando cambia userId

  // Mostra un messaggio di caricamento finché i dati non sono disponibili
  if (isLoading) {
    return <p>Caricamento...</p>;
  }

  // Passa i dati utente al componente DettagliUtente
  return <DettagliUtente user={userData} />;
}




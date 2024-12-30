import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { getCurrentUserUID, getUserByID } from "@/dao/userDAO"; // Aggiungi l'import delle funzioni DAO
import { jsPDF } from "jspdf"; // Importa jsPDF


export default function Statistics() {
    const [user, setUser] = useState(null);
    const [meetingsCount, setMeetingsCount] = useState(0);
    const navigate = useNavigate();
  
    // Recupera i dati dell'utente loggato
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userId = await getCurrentUserUID();  // Ottieni l'ID dell'utente loggato
          const userData = await getUserByID(userId); // Recupera i dati dell'utente da Firestore
  
          if (userData.userType !== "mentee") {
            // Se l'utente non è un mentee, reindirizza alla pagina principale
            navigate("/");
            return;
          }
  
          setUser(userData); // Salva i dati dell'utente
          setMeetingsCount(userData.meetingsCount || 0); // Ottieni il meetingsCount (default a 0 se non esiste)
        } catch (error) {
          console.error("Errore durante il recupero dei dati dell'utente:", error);
        }
      };
  
      fetchUserData();
    }, [navigate]);
  
    // Funzione per scaricare il PDF
    const downloadPDF = () => {
      const doc = new jsPDF();
  
      // Aggiungi il titolo
      doc.setFontSize(18);
      doc.text("Le Tue Statistiche", 20, 20);
  
      // Aggiungi i dati dell'utente
      doc.setFontSize(12);
      doc.text(`Eventi Prenotati: ${meetingsCount}`, 20, 40);
      doc.text(`Feedback Rilasciati: ${meetingsCount}`, 20, 50);
  
      // Genera il PDF
      doc.save("statistiche.pdf"); // Questo scarica il PDF
    };
  
    if (!user) {
      return <div>Loading...</div>; // Mostra un messaggio di caricamento mentre i dati sono in fase di recupero
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
        <Header />
        <div className="flex justify-center items-start mt-10"> {/* Spostato verso l'alto con mt-10 */}
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium">Le Tue Statistiche</h2>
              <button
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                onClick={downloadPDF} // Aggiungi l'handler per il download PDF
              >
                DOWNLOAD PDF
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Eventi Prenotati</span>
                <span>{meetingsCount}</span> {/* Mostra il meetingsCount */}
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Feedback Rilasciati</span>
                <span>{meetingsCount}</span> {/* Mostra il meetingsCount per feedback */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
import React, { useState, useEffect } from "react";  
import Header from "@/components/ui/Header";
import { getUserByID } from "@/dao/userDAO"; // Aggiungi l'import delle funzioni DAO
import { jsPDF } from "jspdf"; // Importa jsPD
import { useAuth } from "@/auth/auth-context";

export default function Statistics() {
    const [user, setUser] = useState(null);
    const [meetingsCount, setMeetingsCount] = useState(0);
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await getUserByID(userId); // Recupera i dati dell'utente da Firestore
          setUser(userData); // Salva i dati dell'utente
          setMeetingsCount(userData.meetingsCount || 0); // Ottieni il meetingsCount (default a 0 se non esiste)
        } catch (error) {
          alert("Errore durante il recupero dei dati dell'utente:" + error);
        }
      };
  
      fetchUserData();
    }, [userId]);
  
    const downloadPDF = () => {
      const doc = new jsPDF();
  
      doc.setFontSize(18);
      doc.text("Le Tue Statistiche", 20, 20);
  
      doc.setFontSize(12);
      doc.text(`Eventi Prenotati: ${meetingsCount}`, 20, 40);
      doc.text(`Feedback Rilasciati: ${meetingsCount}`, 20, 50);
  
      doc.save("statistiche.pdf");
    };
  
    if (!user) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
        <Header />
        <div className="flex justify-center items-start mt-10">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium">Le Tue Statistiche</h2>
              <button
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                onClick={downloadPDF}
              >
                DOWNLOAD PDF
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Eventi Prenotati</span>
                <span>{meetingsCount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Feedback Rilasciati</span>
                <span>{meetingsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

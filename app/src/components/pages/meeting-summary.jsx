import React, { useState, useEffect } from "react"; 
import { useParams, useLocation } from "react-router-dom";
import { fetchMeetingDetails, updateMeetingMinutes } from "@/dao/meetingsDAO";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";

function MeetingSummary() {
  const { meetingid } = useParams(); // Ottiene l'ID del meeting dai parametri dell'URL
  console.log("ID:" + meetingid)
  const [meeting, setMeeting] = useState(null); // Stato per i dati del meeting
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori
  const [successMessage, setSuccessMessage] = useState(""); // Stato per il messaggio di successo

  const location = useLocation();
  console.log('Location:', location); // Stampa l'intero URL e il pathname

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingData = await fetchMeetingDetails(meetingid); // Recupera i dettagli del meeting
        console.log("ID:" + meetingid)
        setMeeting(meetingData); // Aggiorna lo stato con i dati del meeting
      } catch (err) {
        setError(err.message); // Gestisce eventuali errori
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };

    if (meetingid) fetchMeeting();
  }, [meetingid]);

  const handleSaveMinutes = async (minuta) => {
    try {
      await updateMeetingMinutes(meetingid, minuta); // Aggiorna le note del meeting
      setSuccessMessage("Informazioni salvate con successo!");
    } catch (err) {
      console.error("Errore nel salvataggio delle note:", err);
    }
  };

  const handleSubmitForm = () => {
    // Verifica se ci sono modifiche prima di inviare i dati
    const { summary, additionalInfo, notes } = meeting;
    const minuta = {
      summary: summary || "",  // Usa una stringa vuota se "summary" è undefined o falsy
      additionalInfo: additionalInfo || "",  // Usa una stringa vuota se "additionalInfo" è undefined o falsy
      notes: notes || ""  // Cambiato da array a stringa vuota
    };
    handleSaveMinutes(minuta);
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div>Errore: {error}</div>;
  }

  if (!meeting) {
    return <div>Meeting non trovato.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />

      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-emerald-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              {meeting.menteeInitials}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Post-Meeting: {meeting.menteeName}</h2>
              <p className="text-sm opacity-90">
                Data dell'incontro: {meeting.date.toDate().toLocaleDateString("it-IT")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6 mt-8 bg-white rounded-lg shadow-lg">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">
            {successMessage}
          </div>
        )}
        <div className="mt-6 space-y-6">
          {/* Meeting Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Riepilogo dell'Incontro</h3>
              <textarea
                className="mt-4 w-full text-gray-600 border p-2 rounded-md"
                value={meeting.summary || ""}
                onChange={(e) => setMeeting({ ...meeting, summary: e.target.value })}
                placeholder="Aggiungi un riepilogo"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Informazioni Aggiuntive</h3>
              <textarea
                className="mt-4 w-full text-gray-600 border p-2 rounded-md"
                value={meeting.additionalInfo || ""}
                onChange={(e) => setMeeting({ ...meeting, additionalInfo: e.target.value })}
                placeholder="Aggiungi informazioni aggiuntive"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Note e Feedback</h3>
              <textarea
                className="mt-4 w-full text-gray-600 border p-2 rounded-md"
                value={meeting.notes || ""}
                onChange={(e) => setMeeting({ ...meeting, notes: e.target.value })}
                placeholder="Aggiungi una nuova nota..."
              />
            </div>
          </div>

          <Button
            variant="primary"
            className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleSubmitForm}
          >
            Invia Dati
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingSummary;

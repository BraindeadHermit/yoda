import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMeetingDetails } from "@/dao/meetingsDAO";
import Header from "@/components/ui/Header";

function MeetingSummaryMentee() {
  const { meetingid } = useParams(); // Ottiene l'ID del meeting dai parametri dell'URL
  const [meeting, setMeeting] = useState(null); // Stato per i dati del meeting
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingData = await fetchMeetingDetails(meetingid); // Recupera i dettagli del meeting
        setMeeting(meetingData); // Aggiorna lo stato con i dati del meeting
      } catch (err) {
        setError(err.message); // Gestisce eventuali errori
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };

    if (meetingid) fetchMeeting();
  }, [meetingid]);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div>Errore: {error}</div>;
  }

  if (!meeting) {
    return <div>Meeting non trovato.</div>;
  }

  const { menteeName, mentorName, date, time, topic, description, minuta } = meeting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7] text-black">
      <Header />

      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-emerald-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {menteeName.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Post-Meeting: {menteeName}</h2>
              <p className="text-sm opacity-90">
                Data dell'incontro: {date.toDate().toLocaleDateString("it-IT")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6 mt-8 bg-white rounded-lg shadow-lg">
        <div className="space-y-6">
          {/* Meeting Summary */}
          <div className="bg-gray-50 rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Riepilogo dell'Incontro</h3>
              <p className="mt-4 text-gray-600">{description}</p>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="bg-gray-50 rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Dettagli dell'Incontro</h3>
              <p className="mt-2 text-gray-600"><strong>Mentore:</strong> {mentorName}</p>
              <p className="mt-2 text-gray-600"><strong>Orario:</strong> {time}</p>
              <p className="mt-2 text-gray-600"><strong>Argomento:</strong> {topic}</p>
            </div>
          </div>

          {/* Minuta */}
          {minuta && (
            <div className="bg-gray-50 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium">Minuta dell'Incontro</h3>
                <div className="mt-4 text-gray-600">
                  {Object.entries(minuta).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MeetingSummaryMentee;

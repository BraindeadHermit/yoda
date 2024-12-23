"use client";

import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllMentors } from "@/dao/matchingDAO";

export default function MentorGrid() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        console.log("Inizio il recupero dei mentori..."); // Log per debug
        const mentorsData = await getAllMentors();
        setMentors(mentorsData);
        console.log("Mentors caricati:", mentorsData); // Log per debug
      } catch (err) {
        console.error("Errore nel recupero dei mentori:", err);
        setError("Non è stato possibile caricare i dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          I mentori che più fanno per te
        </h2>

        {loading ? (
          <p className="text-white">Caricamento in corso...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="hover:shadow-lg transition-shadow rounded-xl"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold text-[#178563]">
                    {mentor.nome || "Nome non disponibile"}{" "}
                    {mentor.cognome || "Cognome non disponibile"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-[#22A699] opacity-80">
                      {mentor.settore || "Settore non specificato"}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>
                        {mentor.availability || 0} ore disponibili
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-white">Nessun mentore trovato.</p>
        )}
      </main>
    </div>
  );
}

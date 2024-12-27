"use client";

import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllMentors } from "@/dao/matchingDAO";
import { useAuth } from "@/auth/auth-context"; // Importa il contesto Auth
import { useNavigate } from "react-router-dom"; // Per navigare in altre pagine

export default function MentorGrid(UserField) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userType, field, isLogged } = useAuth(); // Ottieni i dati dal contesto Auth
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      if (!isLogged) {
        setError("Devi essere loggato per accedere a questa pagina.");
        setLoading(false);
        return;
      }

      if (userType !== "mentee") {
        setError("Solo i mentee possono accedere a questa pagina.");
        setLoading(false);
        return;
      }

      try {
        if (!field) {
          console.warn("Campo di interesse mancante. Nessun mentore sarà mostrato.");
          setMentors([]);
          setLoading(false);
          return;
        }

        const mentorsData = await getAllMentors(field); // Passa field del mentee alla funzione
        console.log("Mentori recuperati:", mentorsData);
        setMentors(mentorsData);
      } catch (err) {
        console.error("Errore nel recupero dei mentori:", err);
        setError("Non è stato possibile caricare i dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [isLogged, userType, field]);

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
        <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-[#22A699] border-gray-200 rounded-full animate-spin"></div>
      </div>
      
        ) : error ? (
          isLogged ? (
            <div className="flex items-center justify-center mb-20">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Accesso Negato
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Questa pagina è riservata ai mentee.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-2 text-white bg-[#22A699] hover:bg-[#178563] rounded-lg transition font-medium"
              >
                Torna alla Home
              </button>
            </div>
          </div>
          
          
          ) : (
            <div className="flex items-center justify-center mb-50">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Effettua il Login
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Per accedere a questa pagina, devi essere loggato. Fai clic sul pulsante
                qui sotto per effettuare il login.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 text-white bg-[#22A699] hover:bg-[#178563] rounded-lg transition font-medium"
              >
                Vai al Login
              </button>
            </div>
          </div>
          
          )
        ) : mentors.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Scopri i Mentori Ideali per Te
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="hover:shadow-lg transition-shadow rounded-xl bg-white border border-gray-200"
                >
                  <div className="flex justify-center p-4">
                    <img
                      src={mentor.photoUrl || "https://via.placeholder.com/150"}
                      alt={`${mentor.nome || "Mentore"} ${mentor.cognome || ""}`}
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                    />
                  </div>
                  <CardHeader className="p-4 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-800 text-center">
                      {mentor.nome || "Nome non disponibile"}{" "}
                      {mentor.cognome || "Cognome non disponibile"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Meeting Mode:</strong>{" "}
                        {mentor.meetingMode || "Non specificato"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Occupazione:</strong>{" "}
                        {mentor.occupazione || "Non specificata"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Ore disponibili:</strong>{" "}
                        {mentor.availability || 0} ore
                      </p>
                    </div>
                  </CardContent>
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button className="w-full py-2 text-sm font-medium text-white bg-[#22A699] hover:bg-[#178563] rounded-lg transition">
                      Contatta il Mentore
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-800 font-medium">Nessun mentore trovato.</p>
        )}
      </main>
    </div>
  );
}

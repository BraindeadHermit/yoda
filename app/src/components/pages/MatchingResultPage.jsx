import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import { Card } from "@/components/ui/card";
import { getAllMentors } from "@/dao/matchingDAO";
import { useAuth } from "@/auth/auth-context"; // Importa il contesto Auth
import { useNavigate } from "react-router-dom"; // Per navigare in altre pagine

export default function MentorGrid() {
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
                const mentorsData = await getAllMentors(field); // Passa field del mentee alla funzione
                console.log("Mentori recuperati:", mentorsData);
                setMentors(mentorsData);
            } catch (err) {
                console.error("Errore nel recupero dei mentori:", err);
                setError("Non è stato possibile caricare i dati.");
            } finally {
                setLoading(false);
            }
            if (!field || field.trim() === "") {
                console.warn("Campo di interesse mancante o vuoto:", field);
                setError("Il tuo campo di interesse non è impostato. Aggiorna il profilo per procedere.");
                setMentors([]);
                setLoading(false);
                return;
            }


        };

        fetchMentors();
    }, [isLogged, userType, field]);

    
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {mentors.map((mentor, index) => (
                          <Card
                            key={mentor.id || index}
                            className="flex flex-col items-center justify-between hover:shadow-lg transition-shadow rounded-2xl bg-white border border-gray-200 p-6 text-center"
                          >
                            {/* Foto del mentore */}
                            <div className="w-24 h-24 mb-4 rounded-full bg-[#178563] flex items-center justify-center text-white text-3xl font-bold">
                              {mentor.photoUrl ? (
                                <img
                                  src={mentor.photoUrl}
                                  alt={`${mentor.nome || "Mentore"} ${mentor.cognome || ""}`}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                `${mentor.nome?.[0] || "M"}${mentor.cognome?.[0] || "N"}`
                              )}
                            </div>
                  
                            {/* Nome e occupazione */}
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {mentor.nome || "Nome non disponibile"}{" "}
                                {mentor.cognome || "Cognome non disponibile"}
                              </h3>
                              <p className="text-[#178563] text-sm font-medium">
                                {mentor.occupazione || "Occupazione non specificata"}
                              </p>
                            </div>
                  
                            {/* Dettagli del mentore */}
                            <div className="mb-6">
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
                  
                            {/* Pulsante contatta */}
                            <div>
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow px-4 w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold py-3 rounded-lg"
                                onClick={() => {
                                  window.location.href = `/dettagli/${mentor.id}`; // Reindirizza alla pagina di visualizzazione del mentore
                                   }}
                              >
                                Profilo {mentor.nome?.split(" ")[0] || "il Mentore"}
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
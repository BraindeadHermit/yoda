import * as React from "react";
import Header from "../ui/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getMentors } from "@/dao/mentorDAO"; // Aggiorna il percorso in base alla tua struttura
import { useAuth } from "@/auth/auth-context";
import { useNavigate } from "react-router-dom"; // Per reindirizzare al login





export function MentorSearchForm() {
  const [mentors, setMentors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { userType, isLoggedIn } = useAuth(); // Ottieni tipo di utente e stato di login

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn === false) {
      setError("login-required");
    } else if (isLoggedIn === true && userType !== "mentee") {
      setError("access-denied");
    } else {
      setError(null); // Resetta errori se tutto è corretto
    }
  }, [isLoggedIn, userType]);




  const [criteria, setCriteria] = React.useState({
    occupation: "", // Campo principale per la ricerca
    availability: 1,
    meetingMode: "online",
  });


  if (error === "access-denied") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#178563] to-white">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accesso Negato</h2>
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
    );
  }



  if (userType !== "mentee") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#178563] to-white">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accesso Negato</h2>
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
    );
  }



  const searchMentors = async (filters) => {
    setLoading(true);
    setError("");

    try {
      const mentorList = await getMentors(filters);
      setMentors(mentorList);

      if (mentorList.length === 0) {
        setError("Nessun mentore trovato.");
      }
    } catch (err) {
      console.error(err);
      setError("Devi selezionare un campo di interesse per avviare la ricerca.");
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async () => {
    await searchMentors({
      occupation: criteria.occupation,
      availability: criteria.availability,
      meetingMode: criteria.meetingMode,
    });
  };



  const handleInclusion = () => {
    // Logica per gestire il pulsante di inclusione femminile
    navigate("/supfem");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <main className="py-10">
        <Card className="mx-auto max-w-3xl border-[#178563] border-2 bg-white backdrop-blur-sm">

          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-[#178563] drop-shadow-md">
              Trova il tuo Mentore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Campo di Interesse */}
              <div>
                <Label className="text-lg font-semibold mb-2">Campo di Interesse</Label>
                <Select
                  onValueChange={(value) =>
                    setCriteria((prev) => ({ ...prev, occupation: value }))
                  }
                >
                  <SelectTrigger className="w-full h-12 text-base font-medium px-3 rounded-md border border-emerald-600">
                    <SelectValue placeholder="Seleziona campo..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectContent>
                      <SelectItem value="software-development">Sviluppo Software</SelectItem>
                      <SelectItem value="web-development">Sviluppo Web</SelectItem>
                      <SelectItem value="mobile-development">Sviluppo Mobile</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="machine-learning">Machine Learning</SelectItem>
                      <SelectItem value="artificial-intelligence">
                        Intelligenza Artificiale
                      </SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="game-development">Sviluppo Videogiochi</SelectItem>
                      <SelectItem value="it-support">Supporto IT</SelectItem>
                      <SelectItem value="ui-ux-design">Design UI/UX</SelectItem>
                      <SelectItem value="software-testing">Testing Software</SelectItem>
                      <SelectItem value="database-administration">
                        Amministrazione Database
                      </SelectItem>
                      <SelectItem value="robotics">Robotica</SelectItem>
                      <SelectItem value="iot">Internet of Things (IoT)</SelectItem>
                      <SelectItem value="digital-transformation">
                        Trasformazione Digitale
                      </SelectItem>
                      <SelectItem value="big-data">Big Data</SelectItem>

                    </SelectContent>

                  </SelectContent>
                </Select>
              </div>

              {/* Disponibilità (ore settimanali) */}
              <div>
                <Label className="text-lg font-semibold mb-2">Disponibilità (ore settimanali)</Label>
                <div className="mt-2 flex space-x-2">
                  {[...Array(10)].map((_, i) => (
                    <Button
                      key={i}
                      variant={criteria.availability === i + 1 ? "default" : "outline"}
                      className={`h-12 w-12 text-lg p-0 ${criteria.availability === i + 1 ? "bg-emerald-600" : ""
                        }`}
                      onClick={() =>
                        setCriteria((prev) => ({
                          ...prev,
                          availability: i + 1,
                        }))
                      }
                    >
                      {i + 1}
                    </Button>

                  ))}
                </div>
              </div>

              {/* Modalità di Incontro */}
              <div>
                <div>
                  <Label className="text-lg font-semibold mb-2">
                    Modalità di Incontro Preferita
                  </Label>
                  <RadioGroup
                    value={criteria.meetingMode}
                    onValueChange={(value) =>
                      setCriteria((prev) => ({ ...prev, meetingMode: value }))
                    }
                    className="mt-4 grid grid-cols-3 gap-4"
                  >
                    {/* Online */}
                    <div>
                      <input
                        type="radio"
                        id="online"
                        name="meetingMode"
                        value="online"
                        checked={criteria.meetingMode === "online"}
                        onChange={(e) =>
                          setCriteria((prev) => ({ ...prev, meetingMode: e.target.value }))
                        }
                        className="hidden peer"
                      />
                      <label
                        htmlFor="online"
                        className="flex items-center justify-center w-full h-12 rounded-lg border-2 border-emerald-600 text-emerald-600 font-medium shadow-sm cursor-pointer hover:bg-emerald-100 transition-all duration-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-lg"
                      >
                        Online
                      </label>
                    </div>

                    {/* In Persona */}
                    <div>
                      <input
                        type="radio"
                        id="in-person"
                        name="meetingMode"
                        value="in-person"
                        checked={criteria.meetingMode === "in-person"}
                        onChange={(e) =>
                          setCriteria((prev) => ({ ...prev, meetingMode: e.target.value }))
                        }
                        className="hidden peer"
                      />
                      <label
                        htmlFor="in-person"
                        className="flex items-center justify-center w-full h-12 rounded-lg border-2 border-emerald-600 text-emerald-600 font-medium shadow-sm cursor-pointer hover:bg-emerald-100 transition-all duration-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-lg"
                      >
                        In Persona
                      </label>
                    </div>

                    {/* Ibrido */}
                    <div>
                      <input
                        type="radio"
                        id="hybrid"
                        name="meetingMode"
                        value="hybrid"
                        checked={criteria.meetingMode === "hybrid"}
                        onChange={(e) =>
                          setCriteria((prev) => ({ ...prev, meetingMode: e.target.value }))
                        }
                        className="hidden peer"
                      />
                      <label
                        htmlFor="hybrid"
                        className="flex items-center justify-center w-full h-12 rounded-lg border-2 border-emerald-600 text-emerald-600 font-medium shadow-sm cursor-pointer hover:bg-emerald-100 transition-all duration-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-lg"
                      >
                        Ibrido
                      </label>
                    </div>
                  </RadioGroup>
                </div>

              </div>
            </div>

            <div className="space-y-3">
              {/* Pulsante per cercare mentori */}
              <div className="space-y-3">
                {/* Pulsante per cercare mentori */}
                <Button
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold py-3 rounded-lg"
                  onClick={handleSearch}
                >
                  Trova Mentore
                </Button>

                {/* Pulsante per inclusione femminile */}
                <Button
                  className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-lg font-bold py-3 rounded-lg"
                  onClick={handleInclusion}
                >
                  Area Inclusione Femminile
                </Button>
              </div>

              {/* Risultati */}
              {loading && <p>Caricamento...</p>}
              {error && <p className="text-red-600">{error}</p>}
              {mentors && mentors.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-3xl font-bold text-[#178563] text-center mb-8">
                    Mentori Disponibili
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor, index) => (
                      <div
                        key={mentor.id || index}
                        className="flex flex-col items-center justify-between border border-gray-200 rounded-lg shadow-lg bg-white p-6 hover:shadow-xl transition-shadow"
                      >
                        {/* Immagine o iniziali */}
                        <div className="w-24 h-24 rounded-full bg-[#178563] flex items-center justify-center text-white text-3xl font-bold mb-4">
                          {mentor.nome?.[0]?.toUpperCase() || "?"}
                          {mentor.cognome?.[0]?.toUpperCase() || ""}
                        </div>

                        {/* Informazioni principali */}
                        <h4 className="text-xl font-bold text-[#178563] mb-2">
                          {mentor.nome || "Nome non disponibile"} {mentor.cognome || ""}
                        </h4>
                        <p className="text-lg text-gray-600 italic mb-4">
                          {mentor.occupazione || "Occupazione non specificata"}
                        </p>

                        {/* Dettagli */}
                        <div className="text-center text-sm text-gray-600 space-y-1 mb-6">
                          <p>
                            <strong>Meeting Mode:</strong> {mentor.meetingMode || "Non specificato"}
                          </p>
                          <p>
                            <strong>Ore disponibili:</strong> {mentor.availability || 0} ore
                          </p>
                        </div>

                        {/* Bottone */}
                        <Button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow px-4 w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold py-3 rounded-lg"
                            onClick={() => {
                            window.location.href = `/dettagli/${mentor.id}`; // Reindirizza alla pagina di visualizzazione del mentore
                             }}
>
                            Profilo {mentor.nome?.split(" ")[0] || "il Mentore"}
                            </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client";

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
import { useMentorSearch } from "../../auth/mentor-search-logic";

export function MentorSearchForm() {
  const { mentors, loading: searchLoading, error, searchMentors } = useMentorSearch();

  const [loading, setLoading] = React.useState(false); // Aggiunto stato per il caricamento locale

  const [criteria, setCriteria] = React.useState({
    occupation: "", // Campo principale per la ricerca
    availability: 1,
    meetingMode: "online",
  });
  

  const handleSearch = async () => {
    setLoading(true); // Imposta lo stato di caricamento
    try {
      await searchMentors({ 
        occupation: criteria.occupation, 
        availability: criteria.availability, 
        meetingMode: criteria.meetingMode 
      });
      
    } catch (err) {
      console.error("Errore durante la ricerca:", err);
    } finally {
      setLoading(false); // Ripristina lo stato di caricamento
    }
  };
  

  const handleInclusion = () => {
    // Logica per gestire il pulsante di inclusione femminile
    console.log("Navigazione verso l'area di inclusione femminile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <main className="py-10">
        <Card className="mx-auto max-w-md border-[#178563] border-2 bg-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-emerald-700">
              Trova il tuo Mentore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Campo di Interesse */}
              <div>
                <Label>Campo di Interesse</Label>
                <Select
                  onValueChange={(value) =>
                    setCriteria((prev) => ({ ...prev, occupation: value }))
                  }
                >
                  <SelectTrigger>
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
                <Label>Disponibilità (ore settimanali)</Label>
                <div className="mt-2 flex space-x-2">
                  {[...Array(10)].map((_, i) => (
                    <Button
                      key={i}
                      variant={criteria.availability === i + 1 ? "default" : "outline"}
                      className={`h-8 w-8 p-0 ${
                        criteria.availability === i + 1 ? "bg-emerald-600" : ""
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
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSearch}
              >
                Trova Mentore
              </Button>

              {/* Pulsante per inclusione femminile */}
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={handleInclusion}
              >
                Area Inclusione Femminile
              </Button>

{/* Risultati */}
{loading && <p>Caricamento...</p>}
{error && <p className="text-red-600">{error}</p>}
{mentors && mentors.length > 0 && (
  <div className="mt-8">
    <h3 className="text-2xl font-bold text-emerald-700 text-center mb-6">
      Mentori Disponibili
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-center">
      {mentors.map((mentor, index) => (
        <div
          key={mentor.id || index}
          className="border border-gray-200 rounded-lg p-6 shadow-lg bg-white transition-transform transform hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 shadow-inner">
              <img
                src={`https://avatars.dicebear.com/api/initials/${mentor.nome || "Mentore"}.svg`}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            </div>
            <h4 className="text-xl font-bold text-emerald-700 mb-2">
              {mentor.nome || "Nome non disponibile"} {mentor.cognome || ""}
            </h4>
            <p className="text-sm text-gray-600 italic">
              {mentor.occupazione || "Occupazione non specificata"}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-center">
            <p className="text-gray-700">
              <strong>Campo:</strong> {mentor.field || "Non specificato"}
            </p>
            <p className="text-gray-700">
              <strong>Disponibilità:</strong> {mentor.availability || 0} ore/settimana
            </p>
            <p className="text-gray-700">
              <strong>Modalità:</strong>{" "}
              {mentor.meetingMode === "online"
                ? "Online"
                : mentor.meetingMode === "in-person"
                ? "In Persona"
                : mentor.meetingMode === "hybrid"
                ? "Ibrido"
                : "Non specificata"}
            </p>
          </div>
          <div className="mt-6">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md font-semibold">
              Contatta {mentor.nome?.split(" ")[0] || "Mentore"}
            </button>
          </div>
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

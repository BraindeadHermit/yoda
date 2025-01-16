import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../ui/Header";
import { getMentoriFemmina } from "@/dao/supportoDAO"; // Assicurati che il percorso sia corretto

export default function SupportoFemminile() {
  const [mentori, setMentori] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica i mentori quando il componente è montato
  useEffect(() => {
    const fetchMentori = async () => {
      try {
        console.log("Caricamento mentori femmina in corso...");
        const response = await getMentoriFemmina();
        if (response.success) {
          setMentori(response.data);
          console.log("Mentori caricati:", response.data);
        } else {
          console.error("Errore durante il recupero dei mentori:", response.error);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei mentori:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentori();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="container mx-auto max-w-6xl pt-24 space-y-12">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-6">Rete di Supporto Femminile</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Offriamo un ambiente di supporto dedicato alle donne, fornendo mentorship, risorse e una
            comunità per crescere sia personalmente che professionalmente.
          </p>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">I Nostri Mentori e Aree di Supporto</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Scopri i nostri esperti mentori e le aree di supporto disponibili per il tuo sviluppo personale e professionale.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-white text-xl font-semibold animate-pulse">Caricamento in corso...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mentori.length > 0 ? (
              mentori.map((mentore) => (
                <Card key={mentore.id} className="shadow-lg transition-transform transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#178563] to-[#22A699] flex items-center justify-center text-white text-2xl font-bold">
                        {mentore.nome[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {mentore.nome} {mentore.cognome}
                        </h3>
                        <p className="text-sm text-gray-600">{mentore.occupazione}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#178563]">Competenze:</h4>
                      <p className="text-sm text-gray-600">{mentore.competenze || "Non specificato"}</p>
                      <Button
                        className="w-full bg-gradient-to-r from-[#22A699] to-[#178563] text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                        onClick={() => {
                          window.location.href = `/dettagli/${mentore.id}`;
                        }}
                      >
                        Visualizza Mentore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-700 col-span-full">
                <p className="text-lg">Nessun mentore trovato.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

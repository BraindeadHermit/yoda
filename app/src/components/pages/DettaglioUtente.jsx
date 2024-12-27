import { useParams } from 'react-router-dom';
import Header from '../ui/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Users, Cake, ArrowRight, Download } from 'lucide-react';
import { getUserByID } from '@/dao/userDAO';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DettagliUtente({ user }) {
  const isMentor = user.userType === "mentor";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          {/* Header del profilo */}
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-full bg-[#178563] flex items-center justify-center text-white text-3xl font-bold">
                {user.nome[0]}{user.cognome[0]}
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-[#178563] mb-2">
                  {isMentor ? "Profilo del Mentore" : "Profilo del Mentee"}
                </h2>
                <CardTitle className="text-2xl font-bold">
                  {user.nome} {user.cognome}
                </CardTitle>
                <p className="text-[#178563]">{user.occupazione}</p>
              </div>
            </div>
          </CardHeader>

          {/* Corpo della card */}
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dettagli di contatto */}
              <div className="space-y-2">
                {user.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="text-[#178563]" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.contact?.telefono && (
                  <div className="flex items-center space-x-2">
                    <Phone className="text-[#178563]" />
                    <span>{user.contact.telefono || "Non disponibile"}</span>
                  </div>
                )}
              </div>

              {/* Altri dettagli */}
              <div className="space-y-2">
                {user.titoloDiStudio && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="text-[#178563]" />
                    <span>{user.titoloDiStudio}</span>
                  </div>
                )}
                {user.dataNascita && (
                  <div className="flex items-center space-x-2">
                    <Cake className="text-[#178563]" />
                    <span>Nato il: {user.dataNascita}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Briefcase className="text-[#178563]" />
                  <span>Ore disponibili: {user.avaibility || 0} ore settimanali</span>
                </div>
              </div>
            </div>

            {/* Sezione competenze */}
            {user.competenze && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">In cosa sono esperto?</h3>
                <div className="flex flex-wrap gap-2">
                  {user.competenze.split("\n").map((skill, index) => ( //nell'implementazione, viene inserito un testo in cui ogni riga rappresenta una competenza
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

              {/* Sezione Portfolio */}
              {user.portfolioProjects && user.portfolioProjects.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
                  <div className="space-y-4">
                    {user.portfolioProjects.map((project, index) => (
                      <Link
                        key={project.id || index} // Usa una chiave univoca
                        to={`/portfolio/${project.id}`} // Usa un ID o l'indice per la navigazione
                        className="block bg-[#f9f9f9] p-4 rounded-lg hover:bg-[#f1f1f1] shadow-md transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg font-medium text-[#178563]">{project.name}</h4>
                            <p className="text-sm text-gray-600">{project.description.slice(0, 50)}...</p>
                          </div>
                          <ArrowRight className="text-[#178563]" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sezione Curriculum */}
              {user.cv && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Curriculum</h3>
                <div className="flex items-center space-x-2">
                  <Download className="text-[#178563]" />
                  <a
                    href={user.cv}
                    download
                    className="text-[#178563] underline hover:text-[#13674c] transition-all"
                  >
                    Scarica il mio Curriculum
                  </a>
                </div>
              </div>
            )}

            {/* Azione finale */}
            <div className="mt-6 flex justify-end">
              <Button className="bg-[#178563] text-white hover:bg-[#178563]/90">
                {isMentor ? "Richiedi Mentorship" : "Contatta il Mentore"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function DettagliUtenteWrapper() {
  const { userId } = useParams(); // Ottiene l'ID dell'utente dai parametri dell'URL
  const [user, setUser] = useState(null); // Stato per i dati dell'utente
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByID(userId); // Recupera i dati utente
        setUser(userData); // Aggiorna lo stato
        console.log(userData);
      } catch (err) {
        setError(err.message); // Gestisce eventuali errori
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };

    if (userId) fetchUser(userId)}, [userId]);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div>Errore: {error}</div>;
  }

  if (!user) {
    return <div>Utente non trovato.</div>;
  }

  return <DettagliUtente user={user} />;
}
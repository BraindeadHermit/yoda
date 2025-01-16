import { useParams } from 'react-router-dom';
import Header from '../ui/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Briefcase, GraduationCap, Users, Cake, ArrowRight, Download, Clock } from 'lucide-react';
import { getUserByID } from '@/dao/userDAO';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/auth-context';
import { createNotificationMentorship } from '@/dao/notificaDAO';

/* 
    Componente DettagliUtente
    ---------------------------
    - Visualizza i dettagli di un utente specifico.
    - Mostra informazioni come email, data di nascita, titolo di studio, ecc.
    - Fornisce pulsanti azione contestuali:
        - Modifica Profilo (se l'utente sta visualizzando il proprio profilo)
        - Richiedi Mentorship (se l'utente è un mentee e visualizza un mentore)
        - Contatta il Mentee (se l'utente è un mentore e visualizza un mentee)
    
    Props:
    - user: Oggetto con i dettagli dell'utente.
*/


function DettagliUtente({ user }) {
  const { userId, nome, cognome, userType} = useAuth();
  const isMentor = user.userType === "mentor";
  const ownPage = userId === user.id;
  const [successMessage, setSuccessMessage] = useState(""); // Stato per il messaggio di successo

  
  // Funzione che gestisce la richiesta di mentorship
async function handleRichiestaMentorship(user) {
  try {
    createNotificationMentorship(userId, user.id, nome, cognome);
    setSuccessMessage("Notifica inviata con successo!");
    setTimeout(() => setSuccessMessage(""), 3000); // Nasconde il messaggio dopo 3 secondi

  }
  catch (error){
    alert("notifica mentorship non inviata con successo" + error);
  }
}


  function handleClick() {
    if (ownPage) {
      window.location.href = "/edit-profile"; return;
    }
    if (isMentor) handleRichiestaMentorship(user);
    else console.log("[DettaglioUtente] RichiedoContatto")
  }

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
              {/* Dettagli personali */}
              <div className="space-y-2">
                {user.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="text-[#178563]" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.dataNascita && (
                  <div className="flex items-center space-x-2">
                    <Cake className="text-[#178563]" />
                    <span>Data di nascita: {user.dataNascita}</span>
                  </div>
                )}
                {user.sesso && (
                  <div className="flex items-center space-x-2">
                    <Users className="text-[#178563]" />
                    <span>Genere: {user.sesso}</span>
                  </div>
                )}
                {user.titoloDiStudio && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="text-[#178563]" />
                    <span>{user.titoloDiStudio}</span>
                  </div>
                )}
              </div>

              {/* Sezione specifica per Mentor o Mentee */}
              <div className="space-y-2">
                {isMentor ? (
                  <>
                    {user.field && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="text-[#178563]" />
                        <span>Settore IT: {user.field}</span>
                      </div>
                    )}
                    {user.availability && (
                      <div className="flex items-center space-x-2">
                        <Clock className="text-[#178563]" />
                        <span>Disponibilità: {user.availability} ore settimanali</span>
                      </div>
                    )}
                    {user.meetingMode && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-[#178563]" />
                        <span>Modalità di incontro: {user.meetingMode}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {user.field && (
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="text-[#178563]" />
                        <span>Interesse: {user.field}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sezione competenze */}
            {user.competenze && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Competenze</h3>
                <div className="flex flex-wrap gap-2">
                  {user.competenze.split("\n").map((skill, index) => (
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
                      key={index}
                      to={`/dettaglio-progetto`}
                      className="block bg-[#f9f9f9] p-4 rounded-lg hover:bg-[#f1f1f1] shadow-md transition-all"
                      state={{
                        title: project.name || "Progetto senza nome",
                        description: project.description || "Descrizione non disponibile",
                        url: project.url || null,
                        idUtente: user.id
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-medium text-[#178563]">
                            {project.name || "Progetto senza nome"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {project.description?.slice(0, 50) || "Descrizione non disponibile"}...
                          </p>
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
                    Scarica il Curriculum
                  </a>
                </div>
              </div>
            )}

            
             {/* Messaggio di successo */}
             {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
                {successMessage}
              </div>
            )}


            {/* Azione finale */}
            {(ownPage || userType === 'mentee' || !isMentor) && (
            <div className="mt-6 flex justify-end">
              <Button className="bg-[#178563] text-white hover:bg-[#178563]/90" onClick={() => handleClick()}>
                {ownPage
                  ? "Modifica Profilo"
                  : isMentor
                    ? "Richiedi Mentorship"
                    : "Contatta il Mentee"}
              </Button>
            </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


/* 
  Componente DettagliUtenteWrapper
  ---------------------------------
  - Recupera l'ID dell'utente dai parametri URL.
  - Recupera i dati dell'utente dal backend utilizzando `getUserByID`.
  - Gestisce stati di caricamento ed errori.
  - Passa i dati utente al componente `DettagliUtente`.
*/



function DettagliUtenteWrapper() {
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

    if (userId) fetchUser(userId)
  }, [userId]);

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


export { DettagliUtente, DettagliUtenteWrapper };
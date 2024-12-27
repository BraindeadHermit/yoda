import { useEffect, useState } from 'react';
import { getCurrentUserUID, getUserByID } from '@/dao/userDAO';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from '@/components/ui/Header';

export default function LandingPage() {
  const [userName, setUserName] = useState(''); // Stato per il nome dell'utente
  const [userId, setUserId] = useState(null); // Stato per l'UID utente
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    async function fetchUserId() {
      try {
        const uid = await getCurrentUserUID(); // Ottieni l'UID utente
        setUserId(uid);
      } catch (error) {
        console.error('Errore durante il recupero dell\'UID:', error);
      }
    }

    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchUserName() {
      if (!userId) return; // Evita di chiamare Firestore se l'UID non è ancora disponibile
      try {
        const userData = await getUserByID(userId); // Ottieni i dati utente
        setUserName(userData?.nome || 'Utente');
      } catch (error) {
        console.error('Errore durante il recupero del nome utente:', error);
        setUserName('Utente Anonimo');
      } finally {
        setLoading(false);
      }
    }

    fetchUserName();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Benvenuto {userName}
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Connettiti con mentori senior del settore IT e accelera la tua carriera
        </p>
        <Button className="bg-white text-emerald-600 hover:bg-white/90 mb-16">
          Le tue Mentorship
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
            <h3 className="font-semibold mb-3">Esperienza Personalizzata</h3>
            <p className="text-sm text-gray-600">
              Ricevi consigli su misura da professionisti esperti nel tuo campo di interesse
            </p>
          </Card>
          <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
            <h3 className="font-semibold mb-3">Crescita Professionale</h3>
            <p className="text-sm text-gray-600">
              Sviluppa le tue competenze e avanza nella tua carriera con il supporto di mentori di successo
            </p>
          </Card>
          <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
            <h3 className="font-semibold mb-3">Networking di Qualità</h3>
            <p className="text-sm text-gray-600">
              Crea dei rapporti significativi all&apos;interno del settore IT e amplia le tue opportunità
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/Header';

function ProgettoDettaglio() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#178563] to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#178563] mb-4">Progetto non trovato</h2>
          <p className="mb-6">Sembra che tu non abbia selezionato un progetto da visualizzare.</p>
          <Button className="bg-[#178563] text-white hover:bg-[#13674c]" onClick={() => navigate('/HomePageUtente')}>
            Torna alla Homepage
          </Button>
        </div>
      </div>
    );
  }

  const { title, description, url, idUtente } = project;
  console.log(project);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header /> {/* Include l'Header */}
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-full bg-[#178563] flex items-center justify-center text-white text-3xl font-bold">
                {title[0]} {/* Iniziale del titolo */}
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-[#178563] mb-2">{title}</h2>
                <CardTitle className="text-xl font-bold">Dettaglio del Progetto</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Descrizione */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Descrizione</h3>
                <p>{description}</p>
              </div>

              {/* URL opzionale */}
              {url && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Link del Progetto</h3>
                  <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#178563] underline hover:text-[#13674c] transition-all"
                  >
                    Visita il progetto
                  </a>
                </div>
              )}

              {/* Bottone per tornare al portfolio */}
              <div className="mt-6 flex justify-end">
                <Button className="bg-[#178563] text-white hover:bg-[#13674c]" onClick={() => navigate(`/dettagli/${idUtente}`)}>
                  Torna al Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default ProgettoDettaglio;
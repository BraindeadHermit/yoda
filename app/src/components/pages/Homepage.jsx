import Header from '@/components/ui/Header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Benvenuto su Yoda</h2>
          <p className="text-xl mb-8">Connettiti con mentori senior del settore IT e accelera la tua carriera</p>
          <Button className="bg-[#178563] text-white hover:bg-[#0f5e45]">Trova un Mentore</Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Esperienza Personalizzata</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ricevi consigli su misura da professionisti esperti nel tuo campo di interesse.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Crescita Professionale</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sviluppa le tue competenze e avanza nella tua carriera con il supporto di mentori di successo.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Networking di Qualità</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Costruisci relazioni significative all'interno del settore IT e amplia le tue opportunità.</p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold mb-4">Pronto a iniziare il tuo percorso di crescita?</h3>
          <Button className="bg-[#178563] text-white hover:bg-[#0f5e45]"
          onClick={() => navigate ('/register')}>Registrati Ora</Button>
        </section>
      </main>
    </div>
  )
}


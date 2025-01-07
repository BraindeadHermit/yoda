import { useEffect, useState } from "react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { useAuth } from "@/auth/auth-context";
import { useNavigate } from "react-router-dom";
import background from "../assets/images/homepagefinal.png"; // Importing the new local image

export default function HomePageUtente() {
  const { userType, nome } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Valori iniziali:", { userType, nome });
    if (nome && userType) {
      setLoading(false);
    }
  }, [nome, userType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Caricamento...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black font-sans"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Header />
      <main className="container mx-auto px-6 py-12">

        {/* Main Content with Two Columns */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column with Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-16">
              <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
                Benvenuto {nome}
              </h2>
              <p className="text-xl sm:text-2xl mt-4 text-white">
                Connettiti con mentori senior del settore IT e accelera la tua carriera
              </p>
            </div>

            {/* 3 White Boxes Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 ml-4">
              <Card className="bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:scale-x-105 hover:bg-[#0f5e45] hover:text-white border-none">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Esperienza Personalizzata</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ricevi consigli su misura da professionisti esperti nel tuo campo di interesse.</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:scale-x-105 hover:bg-[#0f5e45] hover:text-white border-none">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Crescita Professionale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Sviluppa le tue competenze e avanza nella tua carriera con il supporto di mentori di successo.</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:scale-x-105 hover:bg-[#0f5e45] hover:text-white border-none">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Networking di Qualità</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Costruisci relazioni significative all'interno del settore IT e amplia le tue opportunità.</p>
                </CardContent>
              </Card>
            </section>

            {/* Specific Buttons for Mentee or Mentor */}
            {userType === "mentee" && (
              <section className="text-center mb-12 mt-24">
                <Button
                  className="bg-white text-[#178563] hover:bg-[#0f5e45] hover:text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-110 px-16 py-8 text-4xl font-bold"
                  onClick={() => navigate("/matchingpage")}
                >
                  Trova un Mentore
                </Button>
                <Button
      className="bg-white text-[#178563] hover:bg-[#0f5e45] hover:text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 px-10 py-4 text-xl font-medium mt-4"
      onClick={() => navigate("/mentorsearch")}
    >
      Ricerca il mentore manualmente
    </Button>


              </section>
            )}

            {userType === "mentor" && (
              <section className="text-center mb-12 mt-24">
                <Button
                  className="bg-white text-[#178563] hover:bg-[#0f5e45] hover:text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-110 px-16 py-8 text-4xl font-bold"
                  onClick={() => navigate("/personal-area")}
                >
                  Le tue Mentorship
                </Button>
              </section>
            )}
          </div>

        </section>

      </main>
    </div>
  );
}

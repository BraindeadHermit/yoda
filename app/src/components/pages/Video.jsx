import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../ui/Header";
import VideoCard from "../ui/VideoCard"; // Importa VideoCard
import { useAuth } from "@/auth/auth-context"; // Importa il contesto di autenticazione
import { fetchVideos } from "@/dao/VideoDAO"; // Importa la funzione da VideoDAO.js

export default function Video() {
  const { userType } = useAuth(); // Ottieni il ruolo dell'utente dal contesto
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Richiama la funzione fetchVideos dal VideoDAO.js
    fetchVideos(setVideos, setLoading);
  }, []); // Viene eseguito solo al primo render

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #178563, white)",
      }}
    >
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-[#ffffff] mb-8">Contenuti Video</h2>

        {/* Condizione per mostrare il pulsante solo se l'utente è admin o mentor */}
        {(userType === "admin" || userType === "mentor") && (
          <div className="mb-4">
            <Link
              className="bg-[#178563] hover:bg-[#178563]/90 text-white px-4 py-2 rounded-md"
              to="/InserireVideo"
            >
              Aggiungi video
            </Link>
          </div>
        )}

        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video.id} to={`/video/${video.id}`}>
                <VideoCard
                  title={video.title}
                  thumbnail={
                    (video.videoUrl && video.videoUrl.startsWith("http")) ||
                    video.thumbnail
                      ? video.thumbnail // Mostra la miniatura se disponibile
                      : "https://via.placeholder.com/150?text=Video+non+disponibile" // Immagine di fallback
                  }
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

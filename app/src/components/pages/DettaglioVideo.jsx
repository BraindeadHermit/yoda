import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../ui/Header";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import app from '@/firebase/firebase';
import { isValidURL, fetchVideoDetails } from '@/dao/DettaglioVideoDao'; // Importa le funzioni

export default function DettaglioVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Configura l'emulatore per Firebase Storage
  if (window.location.hostname === 'localhost') {
    connectStorageEmulator(storage, 'localhost', 9199); // Porta dell'emulatore di Firebase Storage
  }

  useEffect(() => {
    // Chiamata alla funzione che recupera i dettagli del video
    fetchVideoDetails(id, db, storage, setVideo, setLoading);
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Caricamento dettagli video...</p>;
  }

  if (!video) {
    return <p className="text-center text-red-500">Video non trovato.</p>;
  }

  // Verifica se l'URL del video è valido
  const hasValidUrl = isValidURL(video.videoUrl);
  const hasValidFile = video.videoFile; // Video caricato come file, controlla se esiste

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, rgb(23, 133, 99), white)",
      }}
    >
      <Header />
      <main className="container mx-auto px-8 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-[#178563] mb-2">
              {video.title}
            </h2>
          </div>

          <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-6">
            {hasValidUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={video.videoUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : hasValidFile ? (
              <video controls className="object-cover w-full h-full">
                <source
                  src={video.videoUrl} // Video file caricato
                  type="video/mp4"
                  alt={video.title}
                />
              </video>
            ) : (
              <img
                src="/fallback-image.jpg"
                alt="Video non disponibile"
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <div className="text-gray-600 text-lg">
            <p>{video.description || "Nessuna descrizione disponibile."}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

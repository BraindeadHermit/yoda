import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../ui/Header";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore"; 
import app from '@/Firebase/firebase';

export default function DettaglioVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  // Function to check if a URL is valid
  function isValidURL(url) {
    try {
      new URL(url);  // Prova a creare un URL per vedere se è valido
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    async function fetchVideoDetails() {
      try {
        const docRef = doc(db, "videos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVideo({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Video non trovato");
        }
      } catch (error) {
        console.error("Errore nel caricamento del video:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoDetails();
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
            <div className="text-gray-700 text-lg">
              <p>{video.author}</p>
            </div>
          </div>

          <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-6">
            {hasValidUrl ? (
              // Se il video ha un URL valido (YouTube, Vimeo, ecc.)
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
              // Se il video è stato caricato come file
              <video
                controls
                className="object-cover w-full h-full"
                src={video.videoFile} // Video file caricato
                alt={video.title}
              />
            ) : (
              // Se nessuno dei due è valido, mostra un'immagine di fallback
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
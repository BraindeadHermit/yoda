import { doc, getDoc, getFirestore } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage"; 
import app from '@/firebase/firebase';

// Funzione per verificare se l'URL è valido
export function isValidURL(url) {
  try {
    new URL(url);  // Prova a creare un URL per vedere se è valido
    return true;
  } catch {
    return false;
  }
}

// Funzione per ottenere i dettagli del video
export async function fetchVideoDetails(id, db, storage, setVideo, setLoading) {
  try {
    const docRef = doc(db, "videos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const videoData = { id: docSnap.id, ...docSnap.data() };
      setVideo(videoData);

      // Se il video è stato caricato come file (e non come URL), ottieni l'URL dal Firebase Storage
      if (videoData.videoFile) {
        const videoRef = ref(storage, `videos/${videoData.videoFile.name}`); // Nome del file video
        const videoUrl = await getDownloadURL(videoRef);
        setVideo((prevVideo) => ({ ...prevVideo, videoUrl })); // Aggiungi l'URL del video al videoData
      }
    } else {
      console.error("Video non trovato");
    }
  } catch (error) {
    console.error("Errore nel caricamento del video:", error);
  } finally {
    setLoading(false);
  }
}

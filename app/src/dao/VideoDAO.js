import { getDocs, collection, getFirestore } from "firebase/firestore";
import app from '@/firebase/firebase';

export async function fetchVideos(setVideos, setLoading) {
  const db = getFirestore(app);
  try {
    const querySnapshot = await getDocs(collection(db, "videos"));
    const videosData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVideos(videosData);
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  } finally {
    setLoading(false);
  }
}

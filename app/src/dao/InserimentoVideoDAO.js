import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app, { storage } from '@/firebase/firebase'; // Assicurati che il percorso sia corretto

const db = getFirestore(app);

export async function uploadVideo({
  title,
  description,
  videoFile,
  videoUrl,
  setUploading,
  setVideoError,
  setTitleError,
  setDescriptionError,
  setUploadSuccess,
  navigate,
  db = getFirestore(app), // Default
  storage = getStorage(app),
}) {
  setUploading(true);
  setVideoError("");
  setTitleError("");
  setDescriptionError("");
  setUploadSuccess(false);

  if (!title) {
    setTitleError("Il titolo è obbligatorio!");
    setUploading(false);
    return;
  }

  if (!description) {
    setDescriptionError("La descrizione è obbligatoria!");
    setUploading(false);
    return;
  }

  if (!videoUrl && !videoFile) {
    setVideoError("Devi compilare almeno uno dei due campi: URL o file video!");
    setUploading(false);
    return;
  }
  if (videoUrl && videoFile) {
    setVideoError("Riempi solo 1 campo: URL o file video!");
    setUploading(false);
    return;
  }

  try {
    let uploadedVideoUrl = videoUrl;

    if (videoFile) {
      const storageRef = ref(storage, `videos/${videoFile.name}`);
      await uploadBytes(storageRef, videoFile);
      uploadedVideoUrl = await getDownloadURL(storageRef);
    }

    const videoData = {
      title,
      description,
      thumbnail: "default-thumbnail-url",
      videoUrl: uploadedVideoUrl,
    };

    await addDoc(collection(db, "videos"), videoData);
    setUploadSuccess(true);
    navigate('/videos');
  } catch (error) {
    console.error("Errore durante il caricamento del video:", error);
    setVideoError("Errore durante il salvataggio del video.");
  } finally {
    setUploading(false);
  }
}
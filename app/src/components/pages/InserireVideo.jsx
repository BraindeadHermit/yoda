import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import app from '@/Firebase/firebase';

export default function InserireVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore(app);

  // Funzione per rimuovere il file caricato
  const removeFile = () => {
    setVideoFile(null);
  };

  async function onSubmit(event) {
    event.preventDefault();
    setUploading(true);
    setVideoError('');
    setTitleError('');
    setDescriptionError('');
    setUploadSuccess(false);

    // Verifica che titolo e descrizione siano compilati
    if (!title) {
      setTitleError('Il titolo è obbligatorio!');
      setUploading(false);
      return;
    }

    if (!description) {
      setDescriptionError('La descrizione è obbligatoria!');
      setUploading(false);
      return;
    }

    // Verifica che almeno uno tra URL e video file sia compilato
    if (!videoUrl && !videoFile) {
      setVideoError('Devi compilare almeno uno dei due campi: URL o file video!');
      setUploading(false);
      return;
    }

    try {
      const videoData = {
        title,
        description,
        thumbnail: "default-thumbnail-url", 
        videoUrl: videoUrl || "default-video-url", 
        author: "Admin",
        role: "Uploader",
      };

      await addDoc(collection(db, "videos"), videoData);
      setUploadSuccess(true);
      setTimeout(() => navigate('/videos'), 3000); // Redirige dopo 3 secondi

    } catch (error) {
      console.error("Errore durante il caricamento del video:", error);
      alert('Errore durante il salvataggio del video.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
      <Header />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] pt-10">
        <main className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#178563]">Carica un nuovo video</h1>
              <p className="text-sm text-[#178563]">
                Compila il form sottostante per caricare un nuovo contenuto video sulla piattaforma.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-[#178563]">Titolo del video</Label>
                  <Input
                    id="title"
                    placeholder="es. Introduzione ai React Hooks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-[#178563] text-[#178563] placeholder-[#178563]/50"
                  />
                  {titleError && <p className="text-red-600 text-lg font-semibold">{titleError}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-[#178563]">Descrizione</Label>
                  <Textarea
                    id="description"
                    placeholder="Inserisci una breve descrizione del video..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[150px] border-[#178563] text-[#178563] placeholder-[#178563]/50"
                    required
                  />
                  {descriptionError && <p className="text-red-600 text-lg font-semibold">{descriptionError}</p>}
                </div>

                {/* Campo per inserire un link del video */}
                <div className="space-y-1">
                  <Label htmlFor="videoUrl" className="text-[#178563]">Link del video (YouTube, Vimeo, ecc.)</Label>
                  <Input
                    id="videoUrl"
                    placeholder="Inserisci il link del video"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="border-[#178563] text-[#178563] placeholder-[#178563]/50"
                  />
                </div>

                {/* Campo per caricare un file video */}
                <div className="space-y-1">
                  <Label htmlFor="video" className="text-[#178563]">File video</Label>
                  {/* Visualizzazione del nome del file caricato */}
                  {videoFile && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#178563] font-semibold">{videoFile.name}</span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-800"
                      >
                        X
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="video"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#178563] rounded-lg cursor-pointer bg-white hover:bg-[#178563]/10"
                    >
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <Upload className="w-8 h-8 mb-2 text-[#178563]" />
                        <p className="text-sm text-[#178563]">
                          <span className="font-semibold">Clicca per caricare</span> o trascina il file qui
                        </p>
                        <p className="text-xs text-[#178563]">
                          MP4, WebM o OGG (MAX. 2GB)
                        </p>
                      </div>
                      <input
                        id="video"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {videoError && <p className="text-red-600 text-lg font-semibold">{videoError}</p>}

              <Button
                type="submit"
                className="w-full bg-[#178563] text-white rounded-full hover:bg-[#0d6145]"
                disabled={uploading}
              >
                {uploading ? 'Caricamento in corso...' : 'Carica video'}
              </Button>
            </form>

            {/* Messaggio di successo */}
            {uploadSuccess && <p className="text-green-600 text-lg font-semibold mt-4">Il video è stato caricato con successo!</p>}
          </div>
        </main>
      </div>
    </div>
  );
} 
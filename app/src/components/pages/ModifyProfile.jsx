'use client';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Importa il componente Textarea
import Header from "@/components/ui/header";
// Importa i moduli necessari da Firebase v9+
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function MentorProfileForm() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState(null); // Stato per il file del CV
  const [portfolioFiles, setPortfolioFiles] = useState([]); // Stato per i file del portfolio
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const storageRef = storage().ref();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        navigate("/login");
        return;
      }
      setUser(authUser);

      const userDocRef = doc(db, "utenti", authUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        setFormState(userDoc.data()); // Imposta lo stato iniziale del form
      } else {
        console.error("Dati utente non trovati.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleInputChange = (key, value) => {
    setFormState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    setCvFile(file); // Salva il file CV caricato
  };

  const handlePortfolioUpload = (e) => {
    const files = e.target.files;
    setPortfolioFiles(Array.from(files)); // Salva i file del portfolio caricati
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userDocRef = doc(db, "utenti", user.uid);
      let newFormState = { ...formState };

      // Carica il CV su Firebase Storage e ottieni l'URL
      if (cvFile) {
        const cvRef = storageRef.child(`cv/${cvFile.name}`);
        await uploadBytes(cvRef, cvFile);
        const cvUrl = await getDownloadURL(cvRef);
        newFormState.cv = cvUrl;
      }

      // Carica i file del portfolio su Firebase Storage e ottieni gli URL
      if (portfolioFiles.length > 0) {
        const portfolioUrls = [];
        for (const file of portfolioFiles) {
          const portfolioRef = storageRef.child(`portfolio/${file.name}`);
          await uploadBytes(portfolioRef, file);
          const portfolioUrl = await getDownloadURL(portfolioRef);
          portfolioUrls.push(portfolioUrl);
        }
        newFormState.portfolioProjects = portfolioUrls;
      }

      await updateDoc(userDocRef, newFormState); // Aggiorna Firestore con i dati del form
      alert("Dati aggiornati con successo!");
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati:", error);
      alert("Si è verificato un errore durante l'aggiornamento dei dati.");
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Caricamento...</p>;
  }

  if (!userData) {
    return <p className="text-center mt-8 text-red-500">Errore nel caricamento dei dati utente.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <div className="mt-8"></div>
      <Card className="mx-auto max-w-2xl p-6">
        <form className="space-y-6" onSubmit={handleSave}>
          <h1 className="text-xl font-semibold text-gray-900">Modifica Profilo Mentee o Mentore</h1>
          <p className="text-sm text-gray-500">Aggiorna la tua informazioni professionali</p>

          <div className="space-y-4">
            {/* Titolo di Studio */}
            <div>
              <Label htmlFor="title">Titolo di Studio</Label>
              <Select
                defaultValue={formState.titoloDiStudio || "laurea"}
                onValueChange={(value) => handleInputChange("titoloDiStudio", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona titolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laurea">Laurea</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="dottorato">Dottorato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Competenze */}
            <div>
              <Label>Competenze</Label>
              <Textarea
                defaultValue={formState.competenze || ""}
                onChange={(e) => handleInputChange("competenze", e.target.value)}
                placeholder="Inserisci le competenze"
              />
            </div>

            {/* Occupazione */}
            <div>
              <Label htmlFor="occupation">Occupazione</Label>
              <Input
                id="occupation"
                defaultValue={formState.occupazione || ""}
                onChange={(e) => handleInputChange("occupazione", e.target.value)}
                placeholder="Inserisci la tua occupazione"
              />
            </div>

            {/* CV - Caricamento file */}
            <div>
              <Label>Carica CV (PDF, DOCX)</Label>
              <Input
                type="file"
                accept=".pdf,.docx"
                onChange={handleCvUpload}
              />
            </div>

            {/* Portfolio - Caricamento file */}
            <div>
              <Label>Carica Portfolio (Immagini, PDF)</Label>
              <Input
                type="file"
                accept=".jpg,.png,.pdf"
                multiple
                onChange={handlePortfolioUpload}
              />
            </div>
          </div>

          {/* Sezione Bottoni */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Annulla
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Salva modifiche
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

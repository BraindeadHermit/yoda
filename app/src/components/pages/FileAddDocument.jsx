'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from '@/components/ui/Header'  // Import dell'header
import { getAuth } from "firebase/auth"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import app from '../../firebase/firebase' // Import di Firebase

export default function UploadForm() {
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const db = getFirestore(app)
  const auth = getAuth(app)
  const storage = getStorage(app) // Inizializza Firebase Storage

  const handleFileUpload = async (e) => {
    e.preventDefault()

    const user = auth.currentUser
    if (!user) {
      setErrorMessage('Non sei autenticato! Effettua il login per aggiungere un contenuto.')
      return
    }

    const file = e.target.elements.file.files[0]
    if (!file) {
      setErrorMessage('Seleziona un file da caricare.')
      return
    }

    let icon = ''
    switch (fileType) {
      case 'pdf':
        icon = '📄'
        break
      case 'png':
        icon = '🖼️'
        break
      case 'doc':
        icon = '📝'
        break
      case 'zip':
        icon = '📦'
        break
      default:
        icon = '📄'
    }

    try {
      const fileRef = ref(storage, 'documents/' + file.name)
      console.log("Tentativo di caricamento del file su Firebase Storage:", fileRef)

      await uploadBytes(fileRef, file)
      console.log("File caricato con successo su Firebase Storage")

      const fileUrl = await getDownloadURL(fileRef)
      console.log("URL generato per il file:", fileUrl)

      await addDoc(collection(db, 'documents'), {
        title,
        author: user.displayName || user.email,
        role,
        type: fileType.toUpperCase(),
        icon,
        createdAt: new Date(),
        filePath: fileUrl, // URL del file caricato
      })

      console.log("Documento aggiunto a Firestore con successo")
      alert('Caricamento completato!')

      setTitle('')
      setRole('')
      setFileName('')
      setFileType('')
      setErrorMessage('')
    } catch (error) {
      console.error("Errore durante il caricamento del file o il salvataggio:", error)
      setErrorMessage("Errore durante il caricamento del file.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
      <Header className="fixed top-0 left-0 right-0 z-10" />
      <div className="pt-16">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-[#178563]">Carica Nuovo Contenuto</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleFileUpload}>
              {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

              <div className="space-y-2">
                <Label htmlFor="name">Nome del Contenuto</Label>
                <Input
                  id="name"
                  placeholder="Inserisci il nome del contenuto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo di File</Label>
                <Select onValueChange={(value) => setFileType(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona il tipo di file" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="zip">ZIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Carica File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  />
                  <div className="flex-1 flex items-center gap-2 p-2 border rounded-md bg-white">
                    <span className="truncate flex-1">
                      {fileName || 'Nessun file selezionato'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('file')?.click()}
                    className="bg-[#178563] hover:bg-[#178563]/90"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Sfoglia
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#178563] hover:bg-[#178563]/90"
              >
                Carica Contenuto
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

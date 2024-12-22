"use client"

import { useEffect, useState } from 'react'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import app from '../../firebase/firebase' // Import dell'istanza di Firebase
import Header from '@/components/ui/Header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from 'react-router-dom'

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const db = getFirestore(app) // Inizializza Firestore
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documents'))
        const docs = querySnapshot.docs.map(doc => ({
          ...doc.data(),  // Estrarre i dati dal documento
          id: doc.id      // Aggiungere l'ID del documento
        }))
        setDocuments(docs) // Impostare i dati nello stato
      } catch (error) {
        console.error('Errore nel recupero dei documenti: ', error)
      }
    }
    fetchDocuments()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Contenuti Media</h2>
        
        {/* Add Document Button */}
        <div className="mb-6">
          <Link
            to="/addfile"
            className="bg-[#178563] hover:bg-[#178563]/90 text-white px-4 py-2 rounded-md"
          >
            Aggiungi Documento
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-[#178563]">
                  <span className="mr-2">{doc.icon}</span>
                  {doc.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium text-lg mb-2">{doc.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{doc.author}</span>
                  <span className="mx-2">•</span>
                  <span className="text-[#178563]">{doc.role}</span>
                </div>
                <div className="mt-4">
                  <a
                    href={doc.filePath} // Usa il campo filePath per il link
                    download={doc.fileName} // Usa il nome del file per il download
                    className="inline-block bg-[#178563] hover:bg-[#178563]/90 text-white px-4 py-2 rounded-md"
                  >
                    Scarica il file
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { getMentors } from '@/dao/mentorDAO.js'

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

// Per usare le API di test (beforeEach, describe, test, ecc.)
// in maniera globale, assicurati di avere `globals: true` in vitest.config.js
// o importa tutto da 'vitest' come stiamo già facendo sopra.

// Pulisce i mock prima di ogni test, così il conteggio delle chiamate parte da 0
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock di firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    getFirestore: vi.fn(), // Se la logica chiama getFirestore()
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn()
  }
})

describe('getMentors', () => {
  test('dovrebbe restituire un array di mentori senza filtri', async () => {
    // 1) Prepara i mock
    getFirestore.mockReturnValueOnce({ /* fake db object */ })
    collection.mockReturnValueOnce({ /* fake collection ref */ })
    query.mockReturnValueOnce({ /* fake query ref */ }) // prima chiamata a query(...) (senza filtri)
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: 'mentor1', data: () => ({ occupazione: 'Informatica', meetingMode: 'online' }) },
        { id: 'mentor2', data: () => ({ occupazione: 'Design', meetingMode: 'online' }) }
      ]
    })

    // 2) Invoca la funzione senza filtri
    const mentors = await getMentors({})

    // 3) Asserzioni
    expect(mentors).toEqual([
      { id: 'mentor1', occupazione: 'Informatica', meetingMode: 'online' },
      { id: 'mentor2', occupazione: 'Design', meetingMode: 'online' }
    ])

    // Verifichiamo le chiamate
    expect(getFirestore).toHaveBeenCalledTimes(1)
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'utenti')
    // query è stato chiamato una volta (senza filtri)
    expect(query).toHaveBeenCalledTimes(1)
    expect(getDocs).toHaveBeenCalledTimes(1)
  })

  test('dovrebbe applicare correttamente i filtri occupation, availability e meetingMode', async () => {
    // 1) Prepara i mock
    getFirestore.mockReturnValueOnce({})
    collection.mockReturnValueOnce({})
    // useremo query.mockReturnValue(...) più volte, perché la funzione aggiunge filtri in modo dinamico
    query.mockImplementation((qRef, ...args) => {
      // qRef: la query di partenza
      // args: i parametri (where(...))
      // possiamo restituire un finto “queryRef” ogni volta
      return { ref: qRef, filters: args }
    })
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'mentor3',
          data: () => ({ occupazione: 'Informatica', availability: 10, meetingMode: 'online' })
        }
      ]
    })

    // 2) Invoca la funzione con tutti i filtri
    const mentors = await getMentors({
      occupation: 'Informatica',
      availability: 8,
      meetingMode: 'online'
    })

    // 3) Asserzioni
    expect(mentors).toEqual([
      { id: 'mentor3', occupazione: 'Informatica', availability: 10, meetingMode: 'online' }
    ])

    // Verifichiamo che i filtri siano stati applicati
    // – Ti aspetti che 'where' sia stato chiamato con "occupazione" == "Informatica"
    // – Poi con "availability" >= 8
    // – Poi con "meetingMode" == "online"
    expect(where).toHaveBeenCalledWith('occupazione', '==', 'Informatica')
    expect(where).toHaveBeenCalledWith('availability', '>=', 8)
    expect(where).toHaveBeenCalledWith('meetingMode', '==', 'online')

    // Controlli generali
    expect(query).toHaveBeenCalledTimes(4) 
    // 1° volta: query(mentorsRef)
    // 2° volta: query(...) con il 1° where
    // 3° volta: query(...) con il 2° where
    // 4° volta: query(...) con il 3° where
    expect(getDocs).toHaveBeenCalledTimes(1)
  })

  test('dovrebbe lanciare un errore in caso di eccezione Firestore', async () => {
    // 1) Prepara i mock per simulare un errore
    getFirestore.mockReturnValueOnce({})
    collection.mockReturnValueOnce({})
    query.mockReturnValueOnce({})
    getDocs.mockRejectedValueOnce(new Error('Errore Firestore'))

    // 2) Invoca la funzione e verifica che lanci un errore
    await expect(
      getMentors({ occupation: 'Informatica', availability: 5 })
    ).rejects.toThrow('Errore durante la ricerca.')
  })
})

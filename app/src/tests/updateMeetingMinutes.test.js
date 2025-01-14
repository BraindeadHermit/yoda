import { describe, test, expect, vi, beforeEach } from 'vitest'
import { updateMeetingMinutes } from '@/dao/meetingsDAO'
import { doc, updateDoc } from 'firebase/firestore'

// Esempio: se usi un db importato da qualche file, potresti aver bisogno di mockarlo anche
// import { db } from '@/firebase/firebase' // <-- se necessario

// Pulizia dei mock prima di ogni test
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock di firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    doc: vi.fn(),
    updateDoc: vi.fn()
  }
})

describe('updateMeetingMinutes', () => {
  test('dovrebbe aggiornare correttamente la minuta', async () => {
    // 1) Prepara i mock
    // doc(...) deve restituire un "document reference" fittizio
    doc.mockReturnValueOnce({ path: 'fake-meeting-ref' })

    // updateDoc(...) risolve correttamente (nessun errore)
    updateDoc.mockResolvedValueOnce()

    // 2) Invoca la funzione
    const meetingId = 'meeting123'
    const minutaTest = 'Contenuto della nuova minuta'
    await updateMeetingMinutes(meetingId, minutaTest)

    // 3) Asserzioni
    expect(doc).toHaveBeenCalledTimes(1)
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'meetings', meetingId)
    expect(updateDoc).toHaveBeenCalledTimes(1)
    expect(updateDoc).toHaveBeenCalledWith(
      { path: 'fake-meeting-ref' },
      { minuta: minutaTest }
    )
  })

  test('dovrebbe lanciare un errore in caso di problema con updateDoc', async () => {
    // 1) Prepara i mock
    doc.mockReturnValueOnce({ path: 'fake-meeting-ref' })
    updateDoc.mockRejectedValueOnce(new Error('Errore Firestore'))

    // 2) Invoca la funzione e verifica che lanci un errore
    await expect(
      updateMeetingMinutes('meetingABC', 'Minuta rotta')
    ).rejects.toThrow('Errore Firestore')

    // 3) Asserzioni
    expect(doc).toHaveBeenCalledTimes(1)
    expect(updateDoc).toHaveBeenCalledTimes(1)
  })
})
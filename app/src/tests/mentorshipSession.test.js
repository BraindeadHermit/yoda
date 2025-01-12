import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchMentorship,
  closeMentorshipSession,
  getById,
  initializeMentorship,
  getByUser
} from "@/dao/mentorshipSessionDAO"; // Path al file delle funzioni  
import { getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { acceptNotificationMentorship } from "@/dao/notificaDAO";

// Mock delle funzioni Firebase
vi.mock('firebase/firestore', async (importOriginal) => {
    const original = await importOriginal();
    return {
      ...original,
      getDoc: vi.fn(),
      getDocs: vi.fn(),
      addDoc: vi.fn(),
      deleteDoc: vi.fn(),
      updateDoc: vi.fn(),
      setDoc: vi.fn(),
      doc: vi.fn(),
    };
});

// Mock delle funzioni di notifica
vi.mock('@/dao/notificaDAO', async (importOriginal) => {
    const original = await importOriginal();
    return {
      ...original,
      acceptNotificationMentorship: vi.fn(),  // Mock della funzione
    };
});

describe("Funzioni di gestione delle sessioni di mentorship", () => {
  const mockSessioneMentorship = {
    id: "mockSessionId",
    mentoreId: "mentor123",
    menteeId: "mentee123",
    stato: "Attiva",
    mentoreNome: "John",
    mentoreCognome: "Doe",
    menteeNome: "Jane",
    menteeCognome: "Smith",
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock della funzione doc per simulare il comportamento di Firebase
    doc.mockImplementation((db, collectionName, docId) => ({
      id: docId,
      path: `${collectionName}/${docId}`,
    }));
  });

  describe("fetchMentorship", () => {
    it("Dovrebbe recuperare le sessioni di mentorship per un determinato utente", async () => {
      // Simula una risposta valida da Firestore
      getDocs.mockResolvedValue({
        docs: [
          { id: "1", data: () => mockSessioneMentorship },
          { id: "2", data: () => ({ ...mockSessioneMentorship, mentoreId: "anotherUser" }) },
        ],
      });

      // Verifica che solo le sessioni dell'utente specificato vengano restituite
      const sessioni = await fetchMentorship("mentor123");
      expect(sessioni).toHaveLength(1);
      expect(sessioni[0].mentoreId).toBe("mentor123");
    });

    it("Dovrebbe gestire gli errori durante il recupero delle sessioni", async () => {
      // Simula un errore durante la chiamata a Firestore
      getDocs.mockRejectedValue(new Error("Fetch failed"));
      await expect(fetchMentorship("mentor123")).rejects.toThrow("Fetch failed");
    });
  });

  describe("getById", () => {
    it("Dovrebbe recuperare una sessione di mentorship tramite ID", async () => {
      // Simula il recupero di una sessione esistente
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockSessioneMentorship,
      });

      // Verifica che i dati della sessione siano restituiti correttamente
      const sessione = await getById("mockSessionId");
      expect(sessione).toEqual({ id: "mockSessionId", ...mockSessioneMentorship });
    });

    it("Dovrebbe lanciare un errore se la sessione non esiste", async () => {
      // Simula una sessione inesistente
      getDoc.mockResolvedValue({ exists: () => false });
      await expect(getById("invalidId")).rejects.toThrow("Mentorship non trovata!");
    });
  });

  describe("closeMentorshipSession", () => {
    it("Dovrebbe cancellare una sessione di mentorship correttamente", async () => {
      // Simula una sessione esistente
      doc.mockResolvedValueOnce("sessionRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockSessioneMentorship,
      });

      // Esegue la chiusura della sessione e verifica le operazioni chiamate
      await closeMentorshipSession(mockSessioneMentorship.id);
      expect(updateDoc).toHaveBeenCalledOnce();
      expect(deleteDoc).toHaveBeenCalledOnce();
    });

    it("Dovrebbe lanciare un errore se la sessione non esiste", async () => {
      // Simula una sessione inesistente
      getDoc.mockResolvedValue({
        exists: () => false,
      });
      await expect(closeMentorshipSession("invalidId")).rejects.toThrow("Mentorship non trovata!");
    });
  });

  describe("initializeMentorship", () => {
    it("Dovrebbe creare una nuova sessione di mentorship tra un mentore e un mentee", async () => {
      const mockDatiMentore = {
        id: "mentore123",
        nome: "John",
        cognome: "Doe",
      };

      const mockDatiMentee = {
        id: "mentee456",
        nome: "Jane",
        cognome: "Smith",
      };

      // Simula il recupero dei dati per mentore e mentee
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockDatiMentore,
      });
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockDatiMentee,
      });

      // Simula la creazione della sessione
      addDoc.mockResolvedValueOnce({ id: "idSessione" });

      await initializeMentorship(mockDatiMentore.id, mockDatiMentee.id);

      // Verifica che la funzione di notifica e addDoc siano state chiamate correttamente
      expect(addDoc).toHaveBeenCalledOnce();
      expect(acceptNotificationMentorship).toHaveBeenCalledOnce();
      expect(acceptNotificationMentorship).toHaveBeenCalledWith(
        mockDatiMentore.id, 
        mockDatiMentee.id,
        mockDatiMentore.nome, 
        mockDatiMentore.cognome
      );
    });

    it("Dovrebbe gestire un errore durante la creazione della sessione", async () => {
      // Simula un errore durante il recupero dei dati
      getDoc.mockRejectedValueOnce(new Error("Database error"));
      await expect(initializeMentorship("mentor123", "mentee123")).rejects.toThrow("Database error");
    });
  });

  describe("getByUser", () => {
    it("Dovrebbe restituire le sessioni di mentorship in cui è coinvolto un determinato utente", async () => {
      const mockSessioni = [
        { mentore: "user1", mentee: "user2", sessionId: "1" },
        { mentore: "user1", mentee: "user4", sessionId: "2" },
      ];

      // Simula il recupero delle sessioni
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockSessioni.map((session) => ({
          id: session.sessionId,
          data: () => session,
        }))
      });

      // Verifica che solo le sessioni rilevanti siano restituite
      const risultato = await getByUser("user1");
      expect(risultato).toEqual([
        { id: "1", mentore: "user1", mentee: "user2", sessionId: "1" },
        { id: "2", mentore: "user1", mentee: "user4", sessionId: "2" }
      ]);
      expect(getDocs).toHaveBeenCalledOnce();
    });

    it("Dovrebbe restituire un array vuoto se l'utente non è coinvolto in sessioni", async () => {
      const mockSessioni = [
        { mentore: "user3", mentee: "user4", sessionId: "3" },
      ];

      // Simula nessuna sessione coinvolta per l'utente
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockSessioni.map((session) => ({
          id: session.sessionId,
          data: () => session,
        }))
      });

      const risultato = await getByUser("user6");
      expect(risultato).toEqual([]);
    });

    it("Dovrebbe gestire un errore durante il recupero delle sessioni", async () => {
      // Simula un errore di Firestore
      getDocs.mockRejectedValue(new Error("Errore Firestore"));
      await expect(getByUser("invalidId")).rejects.toThrow("Errore Firestore");
    });
  });
});

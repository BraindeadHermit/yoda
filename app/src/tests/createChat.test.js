import { describe, it, expect, vi, beforeEach } from "vitest";
import { createChat } from "@/dao/chatSupportoDAO"; // Importa la funzione da testare
import { doc, getDoc, setDoc, query, where, getDocs, getFirestore, collection } from "firebase/firestore";

// Mock delle funzioni Firebase
vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual, // Mantiene le funzioni originali
    getFirestore: vi.fn(() => ({
      collection: vi.fn(), // Mock di collection
    })), // Mock di getFirestore
    doc: vi.fn((db, path) => ({ db, path })),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn((db, name) => ({ db, name })),
  };
});

describe("createChat", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resetta i mock prima di ogni test
  });

  it("dovrebbe creare una nuova chat se non esiste già", async () => {
    // Mock per le funzioni Firebase
    const mockMenteeId = "mentee123";
    const mockMentorId = "mentor456";
    const mockChatId = `${mockMenteeId}_${mockMentorId}`;

    const mockMenteeDoc = { exists: () => true, data: () => ({ nome: "Mario", cognome: "Rossi" }) };
    const mockMentorDoc = { exists: () => true, data: () => ({ nome: "Luigi", cognome: "Verdi" }) };

    getDoc.mockImplementationOnce(() => Promise.resolve(mockMenteeDoc));
    getDoc.mockImplementationOnce(() => Promise.resolve(mockMentorDoc));

    getDocs.mockImplementation(() => Promise.resolve({ forEach: () => {} })); // Nessuna chat esistente

    const setDocMock = vi.fn();
    setDoc.mockImplementation(setDocMock);

    // Esegui la funzione
    const result = await createChat(mockMenteeId, mockMentorId);

    // Verifica il risultato
    expect(result).toEqual({ success: true, id: mockChatId });

    // Verifica che le funzioni siano state chiamate correttamente
    expect(getDoc).toHaveBeenCalledTimes(2); // Una per il mentee, una per il mentore
    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        chatId: mockChatId,
        menteeId: mockMenteeId,
        mentorId: mockMentorId,
        menteeName: "Mario Rossi",
        mentorName: "Luigi Verdi",
        participants: [mockMenteeId, mockMentorId],
      })
    );
  });


  it("dovrebbe restituire un errore se uno degli ID è mancante", async () => {
    const result = await createChat(null, "mentor456");

    expect(result).toEqual({ success: false, error: "Impossibile creare la chat." });
    expect(getDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });
});

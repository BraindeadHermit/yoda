import { describe, test, expect, vi, beforeEach } from "vitest";
import { updateUserProfile } from "@/dao/userDAO";
import { doc, updateDoc } from "firebase/firestore";
import { updateCV } from "@/auth/user-registration";
import { ref, uploadBytes, listAll, deleteObject, getDownloadURL } from "firebase/storage";

// Pulizia dei mock prima di ogni test
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock Firestore
vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    doc: vi.fn(),
    updateDoc: vi.fn(),
    getFirestore: vi.fn().mockReturnValue("mockedFirestoreInstance"),
  };
});

// Mock Firebase Storage
vi.mock("firebase/storage", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ref: vi.fn(),
    uploadBytes: vi.fn().mockResolvedValue({}),
    listAll: vi.fn().mockResolvedValue({ items: [] }),
    deleteObject: vi.fn().mockResolvedValue(),
    getDownloadURL: vi.fn().mockResolvedValue("mockedDownloadURL"),
  };
});

describe("Funzioni per aggiornare il profilo e gestire il CV", () => {
  test("Dovrebbe caricare correttamente il nuovo CV e restituire l'URL di download", async () => {
    const mockFile = new File(["file content"], "mockfile.pdf", { type: "application/pdf" });
    const userId = "user123";

    const result = await updateCV(mockFile, userId);

    expect(ref).toHaveBeenCalledTimes(2);
    expect(listAll).toHaveBeenCalledTimes(1);
    expect(deleteObject).toHaveBeenCalledTimes(0);
    expect(uploadBytes).toHaveBeenCalledTimes(1);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
    expect(result).toBe("mockedDownloadURL");
  });

  test("Dovrebbe cancellare i file esistenti prima di caricare il nuovo CV", async () => {
    const mockFile = new File(["file content"], "mockfile.pdf", { type: "application/pdf" });
    const userId = "user123";

    listAll.mockResolvedValueOnce({
      items: [{ fullPath: "utenti/user123/cv/oldfile.pdf" }],
    });

    await updateCV(mockFile, userId);

    expect(deleteObject).toHaveBeenCalledWith({ fullPath: "utenti/user123/cv/oldfile.pdf" });
    expect(uploadBytes).toHaveBeenCalledTimes(1);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
  });

  describe("Aggiornamento del profilo per un Mentee", () => {
    test("Dovrebbe aggiornare correttamente il profilo del Mentee", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giorgio",
        cognome: "Leo",
        email: "giorgioleo@gmail.com",
        dataNascita: "01/11/1999",
        genere: "Uomo",
        titoloDiStudio: "Laurea",
        competenze: "Sviluppo siti web",
        field: "Sviluppo Software",
      };

      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockResolvedValueOnce();

      const result = await updateUserProfile(uid, profileData);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(doc).toHaveBeenCalledWith(expect.anything(), "utenti", uid);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith({ id: uid }, profileData);
      expect(result).toEqual({ success: true });
    });

    test("Dovrebbe gestire un errore durante l'aggiornamento", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giorgio",
        cognome: "Leo",
        email: "giorgioleo@gmail.com",
        dataNascita: "01/11/1999",
        genere: "Uomo",
        titoloDiStudio: "Laurea",
        competenze: "Sviluppo siti web",
        field: "Sviluppo Software",
      };

      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockRejectedValueOnce(new Error("Errore Firestore"));

      const result = await updateUserProfile(uid, profileData);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: false, error: "Errore Firestore" });
    });

    test("Dovrebbe aggiornare il profilo del Mentee con il portfolio", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giorgio",
        cognome: "Leo",
        email: "giorgioleo@gmail.com",
        dataNascita: "01/11/1999",
        genere: "Uomo",
        titoloDiStudio: "Laurea",
        competenze: "Sviluppo siti web",
        field: "Sviluppo Software",
        portfolioProjects: [
          { description: "Applicazione per la vendita di accessori per animali.", name: "Web App Animal Shop", url: "github.com/animalshop" },
        ],
      };

      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockResolvedValueOnce();

      const result = await updateUserProfile(uid, profileData);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });
  });
  describe("Validazione dei campi nella funzione updateUserProfile", () => {
    test("Dovrebbe lanciare un errore se il campo 'nome' contiene caratteri non validi", async () => {
      const uid = "user123";
      const profileData = {
        nome: "G1orgio!", // Nome non valido
        cognome: "Leo",
      };
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({
        success: false,
        error: "Il campo 'Nome' non è valido. Assicurati che rispetti i criteri.",
      });
    });
  
    test("Dovrebbe lanciare un errore se il campo 'cognome' contiene caratteri non validi", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giorgio",
        cognome: "L3o!", // Cognome non valido
      };
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({
        success: false,
        error: "Il campo 'Cognome' non è valido. Assicurati che rispetti i criteri.",
      });
    });
  
    test("Dovrebbe accettare valori validi per 'nome' e 'cognome'", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giorgio",
        cognome: "Leo",
      };
  
      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockResolvedValueOnce();
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({ success: true });
    });
  
    test("Dovrebbe accettare nomi con spazi e caratteri speciali validi", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Jean'Luc",
        cognome: "D'Orazio",
      };
  
      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockResolvedValueOnce();
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({ success: true });
    });
  
    test("Dovrebbe accettare cognomi lunghi entro il limite di 100 caratteri", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giovanni",
        cognome: "A".repeat(100), // Cognome con 100 caratteri
      };
  
      doc.mockReturnValueOnce({ id: uid });
      updateDoc.mockResolvedValueOnce();
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({ success: true });
    });
  
    test("Dovrebbe lanciare un errore se il cognome supera il limite di 100 caratteri", async () => {
      const uid = "user123";
      const profileData = {
        nome: "Giovanni",
        cognome: "A".repeat(101), // Cognome con 101 caratteri
      };
  
      const result = await updateUserProfile(uid, profileData);
  
      expect(result).toEqual({
        success: false,
        error: "Il campo 'Cognome' non è valido. Assicurati che rispetti i criteri.",
      });
    });
  });
});

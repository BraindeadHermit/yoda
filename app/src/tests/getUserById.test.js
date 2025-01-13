import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserByID } from "../dao/userDAO";
import { getDoc, doc, getFirestore } from "firebase/firestore";

// ✅ Mock di Firebase Firestore
vi.mock('firebase/firestore', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        getDoc: vi.fn(),
        getFirestore: vi.fn().mockReturnValue('mockedFirestoreInstance'),
        doc: vi.fn().mockReturnValue('mockedDocRef'),        
    };
});

describe("getUserByID", () => {
    it("Dovrebbe restituire i dati dell'utente se esiste", async () => {
        const userId = "IGMmibvNHyRzDfYrFECicFuAign1";
        const mockUserData = {
            cognome: "Coticella",
            competenze: "dddd",
            createdAt: "2025-01-08T09:16:44.970Z",
            cv: null,
            dataNascita: "2025-01-10",
            email: "coticella09@gmail.com",
            field: "",
            impiego: "Studente",
            meetingMode: "online",
            nome: "Pietro",
            occupazione: "web-development",
            portfolioProjects: [],
            sesso: "maschio",
            titoloDiStudio: "laurea",
            userType: "mentor",
        };

        // Mock Firestore
        vi.mocked(getDoc).mockResolvedValueOnce({
            exists: () => true,
            data: () => mockUserData,
        });
        
        // Ottieni i dati dell'utente
        const user = await getUserByID(userId);

        // Aggiungi il log per verificare cosa viene restituito dalla funzione

        // Verifica i dati con l'asserzione
        expect(user).toEqual({ id: userId, ...mockUserData });
    });

    it("dovrebbe lanciare un errore se l'utente non esiste", async () => {
        const userId = "nonEsistente";

        vi.mocked(getDoc).mockResolvedValueOnce({
            exists: () => false,
        });

        // Correzione: getUserByID deve restituire una Promise che rigetta
        await expect(getUserByID(userId)).rejects.toThrow("Utente non trovato!");

        expect(getFirestore).toHaveBeenCalled(); 
        expect(doc).toHaveBeenCalledWith("mockedFirestoreInstance", "utenti", userId);
        expect(getDoc).toHaveBeenCalledWith("mockedDocRef");
    });

    it("dovrebbe propagare un errore in caso di problemi con Firestore", async () => {
        const userId = "erroreFirestore";

        vi.mocked(getDoc).mockRejectedValueOnce(new Error("Errore Firestore"));

        await expect(getUserByID(userId)).rejects.toThrow("Errore Firestore");

        expect(getFirestore).toHaveBeenCalled(); 
        expect(doc).toHaveBeenCalledWith("mockedFirestoreInstance", "utenti", userId);
        expect(getDoc).toHaveBeenCalledWith("mockedDocRef");
    });
});

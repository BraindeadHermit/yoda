import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "@/auth/user-registration";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
}));  

describe("test registrazione utente: YO-TC 1.1-1, YO-TC 1.1-2", () => {
  const formData = {
    email: "luigineri@gmail.com",
    password: "Neri!2",
    nome: "Luigi",
    cognome: "Neri",
    genere: "Maschio",
    dataDiNascita: "1990-01-01",
    titoloDiStudio: "Laurea",
    competenze: ["JavaScript", "React"],
    occupazione: "developer",
    userType: "mentee",
    field: "web development",
    cv: ""
  };
  const mockUserCredential = {
    user: { uid: "mocked-uid" },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock delle funzioni Firebase
    getAuth.mockReturnValue({});
    createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
    getFirestore.mockReturnValue({});
    doc.mockReturnValue({});
    setDoc.mockResolvedValue();
  });

  it("dovrebbe registrare un utente con successo", async () => {
    const result = await registerUser(formData, []);
    expect(result).toEqual({ success: true, userId: "mocked-uid" });
  });


  it("dovrebbe gestire un errore di email già registrata", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const result = await registerUser(formData, []);

    expect(result).toEqual({
      success: false,
      error: "L'email è già registrata.",
    });
  });

  it("dovrebbe gestire errori generici", async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error("Errore generico"));

    const result = await registerUser(formData, []);

    expect(result).toEqual({
      success: false,
      error: "Errore generico",
    });
  });
});

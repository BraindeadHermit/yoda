import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllMentors, getMentoriFemmina } from "./src/dao/supportoDAO"; 
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

beforeEach(() => {
    vi.clearAllMocks()
});

vi.mock('firebase/firestore', async (importOriginal) => {
    const original = await importOriginal();
  
    return {
      ...original,
  
      getFirestore: vi.fn(),
      collection: vi.fn(),
      query: vi.fn(),
      where: vi.fn(),
      getDocs: vi.fn(),
    };
  });

  describe("getAllMentors", () => {
    it("dovrebbe restituire un array di mentori se ci sono dati", async () => {
      const mockDocs = [
        { id: "1", data: () => ({ userType: "mentor", name: "John Doe" }) },
        { id: "2", data: () => ({ userType: "mentor", name: "Jane Doe" }) },
      ];
      getDocs.mockResolvedValueOnce({ empty: false, docs: mockDocs });

      const result = await getAllMentors();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        data: [
          { id: "1", userType: "mentor", name: "John Doe" },
          { id: "2", userType: "mentor", name: "Jane Doe" },
        ],
      });
    });

    it("dovrebbe restituire un array vuoto se non ci sono mentori", async () => {
      getDocs.mockResolvedValueOnce({ empty: true, docs: [] });

      const result = await getAllMentors();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        data: [],
      });
    });

    it("dovrebbe gestire correttamente un errore", async () => {
      const mockError = new Error("Errore di Firestore");
      getDocs.mockRejectedValueOnce(mockError);

      const result = await getAllMentors();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: false,
        error: "Errore di Firestore",
      });
    });
  });


  describe("getMentoriFemmina", () => {
    it("dovrebbe restituire un array di mentori di sesso femminile se ci sono dati", async () => {
      const mockDocs = [
        { id: "1", data: () => ({ userType: "mentor", sesso: "femmina", name: "maria gggg" }) },
      ];
      getDocs.mockResolvedValueOnce({ empty: false, docs: mockDocs });

      const result = await getMentoriFemmina();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        data: [
          { id: "1", userType: "mentor", sesso: "femmina", name: "maria gggg" },
        ],
      });
    });

    it("dovrebbe restituire un array vuoto se non ci sono mentori di sesso femminile", async () => {
      getDocs.mockResolvedValueOnce({ empty: true, docs: [] });

      const result = await getMentoriFemmina();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        data: [],
      });
    });

    it("dovrebbe gestire correttamente un errore", async () => {
      const mockError = new Error("Errore di Firestore");
      getDocs.mockRejectedValueOnce(mockError);

      const result = await getMentoriFemmina();

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: false,
        error: "Errore di Firestore",
      });
    });
  });


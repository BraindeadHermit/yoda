import { describe, it, vi, expect, beforeEach } from "vitest";
import { fetchVideos } from "@/dao/VideoDAO"; // Assicurati che il percorso sia corretto
import { getDocs, collection, getFirestore } from "firebase/firestore";

beforeEach(() => {
    vi.clearAllMocks()
});

vi.mock('firebase/firestore', () => {
    const mockDb = {}; // Mock del database
    return {
      collection: vi.fn(() => ({})), // Mock esplicito per collection
      getDocs: vi.fn(), // Mock esplicito per getDocs
      getFirestore: vi.fn(() => mockDb), // Mock esplicito per getFirestore
      doc: vi.fn(),
      updateDoc: vi.fn()
    };
});

describe("fetchVideos", () => {
  let mockSetVideos;
  let mockSetLoading;

  beforeEach(() => {
    mockSetVideos = vi.fn();
    mockSetLoading = vi.fn();

    vi.clearAllMocks();
  });

  it("should fetch and set videos correctly", async () => {
    const mockQuerySnapshot = {
      docs: [
        { id: "1", data: () => ({ title: "Video 1", description: "Description 1" }) },
        { id: "2", data: () => ({ title: "Video 2", description: "Description 2" }) },
      ],
    };

    getDocs.mockResolvedValue(mockQuerySnapshot);

    await fetchVideos(mockSetVideos, mockSetLoading);

    expect(collection).toHaveBeenCalledWith(expect.any(Object), "videos");
    expect(getDocs).toHaveBeenCalledWith({}); // Controllo che getDocs venga chiamato con il valore restituito dal mock di collection
    expect(mockSetVideos).toHaveBeenCalledWith([
      { id: "1", title: "Video 1", description: "Description 1" },
      { id: "2", title: "Video 2", description: "Description 2" },
    ]);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should handle errors during data fetching", async () => {
    const mockError = new Error("Fetch failed");
    getDocs.mockRejectedValue(mockError);

    await fetchVideos(mockSetVideos, mockSetLoading);

    expect(collection).toHaveBeenCalledWith(expect.any(Object), "videos");
    expect(getDocs).toHaveBeenCalledWith({}); // Controllo che getDocs venga chiamato con il valore restituito dal mock di collection
    expect(mockSetVideos).not.toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});

import { describe, it, vi, expect, beforeEach } from "vitest";
import { fetchVideoDetails } from "@/dao/DettaglioVideoDao";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

beforeEach(() => {
    vi.clearAllMocks()
  });

vi.mock("firebase/firestore", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    doc: vi.fn(),
    getDoc: vi.fn(),
  };
});

vi.mock('firebase/storage', async (importOriginal) => {
    // Importa il modulo originale (quello reale)
    const original = await importOriginal();
  
    return {
      // Copia TUTTE le export del modulo reale
      ...original,
    
      ref: vi.fn(),
      getDownloadURL: vi.fn(),
    };
  });
  

describe("fetchVideoDetails", () => {
  let mockSetVideo;
  let mockSetLoading;

  beforeEach(() => {
    mockSetVideo = vi.fn();
    mockSetLoading = vi.fn();
    vi.clearAllMocks();
  });

  it("should fetch video details and update state when video exists in Firestore", async () => {
    // Arrange
    const mockId = "mockVideoId";
    const mockDb = {};
    const mockStorage = {};
    const mockVideoData = { title: "Test Video", videoFile: { name: "test.mp4" } };
    const mockVideoUrl = "https://example.com/test-video.mp4";

    const mockDocRef = {};
    const mockDocSnap = {
      exists: vi.fn().mockReturnValue(true),
      id: mockId,
      data: vi.fn().mockReturnValue(mockVideoData),
    };

    doc.mockReturnValue(mockDocRef);
    getDoc.mockResolvedValue(mockDocSnap);
    ref.mockImplementation((_, path) => `mockRef-${path}`);
    getDownloadURL.mockResolvedValue(mockVideoUrl);

    // Act
    await fetchVideoDetails(mockId, mockDb, mockStorage, mockSetVideo, mockSetLoading);

    // Assert
    expect(doc).toHaveBeenCalledWith(mockDb, "videos", mockId);
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(ref).toHaveBeenCalledWith(mockStorage, "videos/test.mp4");
    expect(getDownloadURL).toHaveBeenCalledWith("mockRef-videos/test.mp4");
    expect(mockSetVideo).toHaveBeenCalledWith({ id: mockId, ...mockVideoData });
    expect(mockSetVideo).toHaveBeenCalledWith(expect.any(Function)); // Verifica che venga aggiornato anche il videoUrl
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should fetch video details and not fetch URL if videoFile is missing", async () => {
    // Arrange
    const mockId = "mockVideoId";
    const mockDb = {};
    const mockStorage = {};
    const mockVideoData = { title: "Test Video" }; // Nessun videoFile

    const mockDocRef = {};
    const mockDocSnap = {
      exists: vi.fn().mockReturnValue(true),
      id: mockId,
      data: vi.fn().mockReturnValue(mockVideoData),
    };

    doc.mockReturnValue(mockDocRef);
    getDoc.mockResolvedValue(mockDocSnap);

    // Act
    await fetchVideoDetails(mockId, mockDb, mockStorage, mockSetVideo, mockSetLoading);

    // Assert
    expect(doc).toHaveBeenCalledWith(mockDb, "videos", mockId);
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(ref).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(mockSetVideo).toHaveBeenCalledWith({ id: mockId, ...mockVideoData });
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should log error and set loading to false if video does not exist", async () => {
    // Arrange
    const mockId = "mockVideoId";
    const mockDb = {};
    const mockStorage = {};

    const mockDocRef = {};
    const mockDocSnap = {
      exists: vi.fn().mockReturnValue(false), // Video non trovato
    };

    doc.mockReturnValue(mockDocRef);
    getDoc.mockResolvedValue(mockDocSnap);

    console.error = vi.fn(); // Mock per intercettare errori

    // Act
    await fetchVideoDetails(mockId, mockDb, mockStorage, mockSetVideo, mockSetLoading);

    // Assert
    expect(doc).toHaveBeenCalledWith(mockDb, "videos", mockId);
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(mockSetVideo).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Video non trovato");
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should handle errors gracefully and log them", async () => {
    // Arrange
    const mockId = "mockVideoId";
    const mockDb = {};
    const mockStorage = {};

    const mockError = new Error("Firestore error");
    doc.mockImplementation(() => {
      throw mockError;
    });

    console.error = vi.fn(); // Mock per intercettare errori

    // Act
    await fetchVideoDetails(mockId, mockDb, mockStorage, mockSetVideo, mockSetLoading);

    // Assert
    expect(doc).toHaveBeenCalledWith(mockDb, "videos", mockId);
    expect(console.error).toHaveBeenCalledWith("Errore nel caricamento del video:", mockError);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});

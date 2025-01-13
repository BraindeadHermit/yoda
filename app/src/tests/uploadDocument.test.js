import { describe, it, vi, expect, beforeEach } from "vitest";
import { uploadDocument } from "@/dao/contenutiDAO";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { addDoc, collection, getFirestore } from "firebase/firestore";

// Mock completo per firebase/storage
vi.mock("firebase/storage", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      ref: vi.fn(),
      uploadBytes: vi.fn(),
      getDownloadURL: vi.fn(),
      getStorage: vi.fn(() => "mockStorage"), // Mock di getStorage
    };
  });

// Mock parziale per firebase/firestore con supporto a getFirestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    addDoc: vi.fn(),
    collection: vi.fn(() => "mockCollection"),
    getFirestore: vi.fn(() => "mockFirestore"), // Mock di getFirestore
  };
});

describe("uploadDocument", () => {
  const mockFile = new File(["mock content"], "testFile.txt", { type: "text/plain" });
  const mockData = { title: "Test Document", description: "A test document." };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload a file and save metadata to Firestore successfully", async () => {
    const mockFileUrl = "https://mockurl.com/testFile.txt";
    const mockDocRef = { id: "mockDocId" };

    ref.mockReturnValue("mockRef");
    uploadBytes.mockResolvedValue();
    getDownloadURL.mockResolvedValue(mockFileUrl);
    addDoc.mockResolvedValue(mockDocRef);

    const result = await uploadDocument(mockData, mockFile);

    expect(ref).toHaveBeenCalledWith(expect.anything(), `documents/${mockFile.name}`);
    expect(uploadBytes).toHaveBeenCalledWith("mockRef", mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith("mockRef");
    expect(collection).toHaveBeenCalledWith("mockFirestore", "documents");
    expect(addDoc).toHaveBeenCalledWith("mockCollection", {
      ...mockData,
      filePath: mockFileUrl,
      createdAt: expect.any(Date),
    });

    expect(result).toEqual({
      ...mockData,
      filePath: mockFileUrl,
      createdAt: expect.any(Date),
      id: mockDocRef.id,
    });
  });

  it("should throw an error if file upload fails", async () => {
    const mockError = new Error("Upload failed");
    ref.mockReturnValue("mockRef");
    uploadBytes.mockRejectedValue(mockError);

    await expect(uploadDocument(mockData, mockFile)).rejects.toThrow("Errore durante il caricamento del documento.");

    expect(ref).toHaveBeenCalledWith(expect.anything(), `documents/${mockFile.name}`);
    expect(uploadBytes).toHaveBeenCalledWith("mockRef", mockFile);
    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
  });

  it("should throw an error if Firestore save fails", async () => {
    const mockFileUrl = "https://mockurl.com/testFile.txt";
    const mockError = new Error("Firestore save failed");

    ref.mockReturnValue("mockRef");
    uploadBytes.mockResolvedValue();
    getDownloadURL.mockResolvedValue(mockFileUrl);
    addDoc.mockRejectedValue(mockError);

    await expect(uploadDocument(mockData, mockFile)).rejects.toThrow("Errore durante il caricamento del documento.");

    expect(ref).toHaveBeenCalledWith(expect.anything(), `documents/${mockFile.name}`);
    expect(uploadBytes).toHaveBeenCalledWith("mockRef", mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith("mockRef");
    expect(addDoc).toHaveBeenCalledWith("mockCollection", {
      ...mockData,
      filePath: mockFileUrl,
      createdAt: expect.any(Date),
    });
  });
});
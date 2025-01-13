import { describe, it, vi, expect, beforeEach } from "vitest";
import { getAllDocuments } from "@/dao/contenutiDAO";
import { getDocs, collection, getFirestore } from "firebase/firestore";

// Mock completo per firebase/firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getDocs: vi.fn(),
    collection: vi.fn(() => "mockCollection"),
    getFirestore: vi.fn(() => "mockFirestore"),
  };
});

describe("getAllDocuments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all documents from Firestore", async () => {
    const mockDocs = [
      { id: "doc1", data: () => ({ title: "Document 1", content: "Content 1" }) },
      { id: "doc2", data: () => ({ title: "Document 2", content: "Content 2" }) },
    ];

    getDocs.mockResolvedValue({ docs: mockDocs });

    const result = await getAllDocuments();

    expect(collection).toHaveBeenCalledWith("mockFirestore", "documents");
    expect(getDocs).toHaveBeenCalledWith("mockCollection");
    expect(result).toEqual([
      { id: "doc1", title: "Document 1", content: "Content 1" },
      { id: "doc2", title: "Document 2", content: "Content 2" },
    ]);
  });

  it("should throw an error if fetching documents fails", async () => {
    const mockError = new Error("Firestore error");
    getDocs.mockRejectedValue(mockError);

    await expect(getAllDocuments()).rejects.toThrow("Errore durante il recupero dei documenti.");

    expect(collection).toHaveBeenCalledWith("mockFirestore", "documents");
    expect(getDocs).toHaveBeenCalledWith("mockCollection");
  });
});
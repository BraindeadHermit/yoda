import { describe, it, vi, expect, beforeEach } from "vitest";
import { uploadVideo } from "@/dao/InserimentoVideoDAO";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

beforeEach(() => {
  vi.clearAllMocks()
});

vi.mock('firebase/firestore', async (importOriginal) => {
  // Importa il modulo originale (quello reale)
  const original = await importOriginal();

  return {
    // Copia TUTTE le export del modulo reale
    ...original,

    collection: vi.fn(),
    addDoc: vi.fn(),
    getFirestore: vi.fn(),
  };
});


vi.mock('firebase/storage', async (importOriginal) => {
  // Importa il modulo originale (quello reale)
  const original = await importOriginal();

  return {
    // Copia TUTTE le export del modulo reale
    ...original,
  
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  };
});

describe("uploadVideo", () => {
  let mockSetUploading;
  let mockSetVideoError;
  let mockSetTitleError;
  let mockSetDescriptionError;
  let mockSetUploadSuccess;
  let mockNavigate;

  beforeEach(() => {
    mockSetUploading = vi.fn();
    mockSetVideoError = vi.fn();
    mockSetTitleError = vi.fn();
    mockSetDescriptionError = vi.fn();
    mockSetUploadSuccess = vi.fn();
    mockNavigate = vi.fn();

    vi.clearAllMocks();
  });

  it("should set an error if the title is missing", async () => {
    await uploadVideo({
      title: "",
      description: "A description",
      videoFile: null,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
    });

    expect(mockSetTitleError).toHaveBeenCalledWith("Il titolo è obbligatorio!");
    expect(mockSetUploading).toHaveBeenCalledWith(false);
  });

  it("should set an error if the description is missing", async () => {
    await uploadVideo({
      title: "A title",
      description: "",
      videoFile: null,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
    });

    expect(mockSetDescriptionError).toHaveBeenCalledWith("La descrizione è obbligatoria!");
    expect(mockSetUploading).toHaveBeenCalledWith(false);
  });

  it("should set an error if both videoUrl and videoFile are missing", async () => {
    await uploadVideo({
      title: "A title",
      description: "A description",
      videoFile: null,
      videoUrl: "",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
    });

    expect(mockSetVideoError).toHaveBeenCalledWith("Devi compilare almeno uno dei due campi: URL o file video!");
    expect(mockSetUploading).toHaveBeenCalledWith(false);
  });

  it("should set an error if both videoUrl and videoFile are provided", async () => {
    await uploadVideo({
      title: "A title",
      description: "A description",
      videoFile: new File(["mock content"], "Video6- Intelligenza Artificiale.mp4"),
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
    });

    expect(mockSetVideoError).toHaveBeenCalledWith("Riempi solo 1 campo: URL o file video!");
    expect(mockSetUploading).toHaveBeenCalledWith(false);
  });

  it("should upload videoFile and save video data", async () => {
    const mockVideoFile = new File(["mock content"], "Video6- Intelligenza Artificiale.mp4", { type: "video/mp4" });
    const mockStorageRef = {};
    const mockDownloadURL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    ref.mockReturnValue(mockStorageRef);
    uploadBytes.mockResolvedValue();
    getDownloadURL.mockResolvedValue(mockDownloadURL);
    addDoc.mockResolvedValue();

    await uploadVideo({
      title: "A title",
      description: "A description",
      videoFile: mockVideoFile,
      videoUrl: "",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
      storage: {},
      db: {},
    });

    expect(ref).toHaveBeenCalledWith({}, `videos/${mockVideoFile.name}`);
    expect(uploadBytes).toHaveBeenCalledWith(mockStorageRef, mockVideoFile);
    expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
    expect(addDoc).toHaveBeenCalledWith(collection({}, "videos"), {
      title: "A title",
      description: "A description",
      thumbnail: "default-thumbnail-url",
      videoUrl: mockDownloadURL,
    });
    expect(mockSetUploadSuccess).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith("/videos");
  });

  it("should handle errors during upload process", async () => {
    const mockError = new Error("Upload failed");
    uploadBytes.mockRejectedValue(mockError);

    await uploadVideo({
      title: "A title",
      description: "A description",
      videoFile: new File(["mock content"], "Video6- Intelligenza Artificiale.mp4"),
      videoUrl: "",
      setUploading: mockSetUploading,
      setVideoError: mockSetVideoError,
      setTitleError: mockSetTitleError,
      setDescriptionError: mockSetDescriptionError,
      setUploadSuccess: mockSetUploadSuccess,
      navigate: mockNavigate,
      storage: {},
      db: {},
    });

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploadSuccess).not.toHaveBeenCalledWith(true);
  });
});

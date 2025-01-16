import { describe, it, vi, expect, beforeEach } from "vitest";
import {
  getChatsByUserId,
  getSupportMessages,
  sendSupportMessage,
} from "@/dao/chatSupportoDAO";
import {
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn((_, id) => ({ id })),
    getDoc: vi.fn(() => ({
      exists: () => true,
      data: () => ({ nome: "Mock", cognome: "User" }),
    })),
    addDoc: vi.fn(async (_, data) => ({ id: "mockDocId", ...data })),
    setDoc: vi.fn(async () => ({})),
    updateDoc: vi.fn(async () => ({})),
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn((_, collectionName) => ({ collectionName })),
  };
});

describe("chatSupportoDAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getChatsByUserId", () => {
    it("should retrieve chats for a given user ID", async () => {
      const mockChats = [
        {
          id: "chat1",
          data: () => ({
            menteeId: "mentee1",
            mentorId: "mentor1",
            lastMessageSenderId: "otherUser",
          }),
        },
      ];

      const mockMenteeDoc = {
        exists: () => true,
        data: () => ({ nome: "John", cognome: "Doe" }),
      };
      const mockMentorDoc = {
        exists: () => true,
        data: () => ({ nome: "Jane", cognome: "Smith" }),
      };

      getDocs.mockResolvedValue({ docs: mockChats });
      getDoc.mockResolvedValueOnce(mockMenteeDoc).mockResolvedValueOnce(mockMentorDoc);

      const result = await getChatsByUserId("user1", "mentee");

      expect(getDocs).toHaveBeenCalled();
      expect(getDoc).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        success: true,
        data: [
          {
            id: "chat1",
            menteeId: "mentee1",
            mentorId: "mentor1",
            lastMessageSenderId: "otherUser",
            menteeName: "John Doe",
            mentorName: "Jane Smith",
            isNewMessage: true,
          },
        ],
      });
    });

    it("should return an empty array if no chats are found", async () => {
      getDocs.mockResolvedValue({ empty: true, docs: [] });

      const result = await getChatsByUserId("user1", "mentee");

      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: [] });
    });
  });

  describe("getSupportMessages", () => {
    it("should retrieve messages for a given chat ID", async () => {
      const mockMessages = [
        { id: "msg1", data: () => ({ text: "Hello", timestamp: 123456 }) },
        { id: "msg2", data: () => ({ text: "Hi", timestamp: 123457 }) },
      ];

      getDocs.mockResolvedValue({ docs: mockMessages });

      const result = await getSupportMessages("chat1");

      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual([
        { id: "msg1", text: "Hello", timestamp: 123456 },
        { id: "msg2", text: "Hi", timestamp: 123457 },
      ]);
    });

    it("should throw an error if message retrieval fails", async () => {
      getDocs.mockRejectedValue(new Error("Firestore error"));

      await expect(getSupportMessages("chat1")).rejects.toThrow("Impossibile recuperare i messaggi.");
    });
  });

  describe("sendSupportMessage", () => {
    it("should send a message and update the chat", async () => {
      const mockMessage = {
        chatId: "chat1",
        text: "Hello",
        timestamp: 123456,
        senderId: "user1",
      };

      const mockChatDoc = { exists: () => true };

      getDoc.mockResolvedValue(mockChatDoc);
      addDoc.mockResolvedValue({});
      updateDoc.mockResolvedValue();

      await sendSupportMessage(mockMessage);

      expect(addDoc).toHaveBeenCalledWith(expect.anything(), mockMessage);
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        lastMessage: "Hello",
        updatedAt: 123456,
        lastMessageSenderId: "user1",
      });
    });

    it("should throw an error if sending the message fails", async () => {
      const mockMessage = { chatId: "chat1", text: "Hello", timestamp: 123456 };

      addDoc.mockRejectedValue(new Error("Firestore error"));

      await expect(sendSupportMessage(mockMessage)).rejects.toThrow("Impossibile inviare il messaggio.");
    });
  });
});

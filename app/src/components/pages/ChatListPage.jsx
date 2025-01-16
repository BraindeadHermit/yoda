import React, { useEffect, useState } from "react";
import { getChatsByUserId } from "@/dao/chatSupportoDAO";
import { useAuth } from "@/auth/auth-context";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);

export default function ChatListPage() {
  const { userId, userType } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!userId) {
          setError("Utente non autenticato.");
          return;
        }

        const result = await getChatsByUserId(userId);

        if (result.success) {
          setChats(result.data);
        } else {
          setError(result.error || "Errore durante il recupero delle chat.");
        }
      } catch (error) {
        setError("Errore generale durante il recupero delle chat.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const chatsQuery = query(
      collection(db, "supportChat"),
      where("participants", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const updatedChats = snapshot.docs.map((doc) => {
        const chat = doc.data();
        const isNewMessage = chat.lastMessageSenderId !== userId;
        return {
          id: doc.id,
          ...chat,
          isNewMessage,
        };
      });
      setChats(updatedChats);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
        <p className="text-xl font-medium text-white animate-pulse">
          Caricamento delle chat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
        <p className="text-lg text-red-100 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">
          Le Tue Chat
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          {chats.length > 0 ? (
            <div className="space-y-6">
              {chats.map((chat) => {
                const partnerName =
                  userType === "mentor"
                    ? chat.menteeName || "Mentee Sconosciuto"
                    : chat.mentorName || "Mentore Sconosciuto";

                const isNewMessage = chat.isNewMessage || false;

                return (
                  <div
                    key={`${chat.id}-${isNewMessage}`}
                    className={`flex items-center justify-between p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer bg-white border ${
                      isNewMessage ? "border-l-8 border-green-500" : "border-l-4 border-gray-200"
                    }`}
                    onClick={() =>
                      navigate("/chat-support", {
                        state: {
                          chatId: chat.id,
                          mentorId: chat.mentorId,
                          problemType: "",
                        },
                      })
                    }
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#178563] to-[#22A699] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {partnerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {partnerName}
                        </h3>
                        <p className="text-base text-gray-600 truncate w-80">
                          {chat.lastMessage || "Nessun messaggio disponibile"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-400">
                        {chat.updatedAt
                          ? new Date(chat.updatedAt).toLocaleDateString([], {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                          : "N/D"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {chat.updatedAt
                          ? new Date(chat.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/D"}
                      </p>
                      {isNewMessage && (
                        <div className="relative flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                          <span className="absolute w-8 h-8 bg-red-200 rounded-full animate-ping"></span>
                          <span className="relative block w-4 h-4 bg-red-600 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 mb-4">
                Nessuna chat trovata.
              </p>
              <button
                className="px-8 py-3 bg-[#22A699] text-white font-semibold rounded-lg shadow-md hover:bg-[#178563] transition"
                onClick={() => navigate("/personal-area")}
              >
                Inizia una nuova conversazione
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

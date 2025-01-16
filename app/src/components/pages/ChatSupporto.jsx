import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "@/firebase/firebase";
import { createChat, sendSupportMessage, getSupportMessages } from "@/dao/chatSupportoDAO";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { useAuth } from "@/auth/auth-context";

const db = getFirestore(app);

export default function ChatSupporto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userType } = useAuth(); // Importa solo le variabili richieste

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menteeName, setMenteeName] = useState("Mentee Sconosciuto");
  const [mentorName, setMentorName] = useState("Mentore Sconosciuto");
  const [user, setUser] = useState({ nome: "", cognome: "", occupazione: "" });
  const { chatId, menteeId, mentoreId, menteeNome, mentoreNome, problemType } = location.state || {};

  if (!userId) {
    alert("Utente non autenticato.");
    navigate("/login");
    return null;
  }

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!chatId) {
          console.warn("Chat ID non disponibile. Creazione di una nuova chat...");
          if (!mentoreId) {
            setError("Mentor ID mancante.");
            return;
          }

          const menteeId = userType === "mentee" ? userId : mentoreId;
          const mentorIdFinal = userType === "mentor" ? userId : mentoreId;

          // Creazione della chat con mentorIdFinal o mentoreId
          const createChatResponse = await createChat(menteeId, mentorIdFinal || mentoreId, "", "");
          if (!createChatResponse.success) {
            throw new Error("Errore nella creazione della chat.");
          }

          navigate("/chat-support", {
            state: { chatId: createChatResponse.id, mentorId: mentorIdFinal || mentoreId, problemType },
          });
          return;
        }

        // Recupera i dettagli della chat
        const chatDocRef = doc(db, "supportChat", chatId);
        const chatDoc = await getDoc(chatDocRef);
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setMenteeName(chatData.menteeName || "Mentee Sconosciuto");
          setMentorName(chatData.mentorName || "Mentore Sconosciuto");

          if (userType === "mentor") {
            setUser({
              nome: chatData.menteeName.split(" ")[0],
              cognome: chatData.menteeName.split(" ")[1] || "",
              occupazione: "Mentee",
            });
          } else {
            setUser({
              nome: chatData.mentorName.split(" ")[0],
              cognome: chatData.mentorName.split(" ")[1] || "",
              occupazione: "Mentore",
            });
          }
        }

        // Controllo per problemType
        if (problemType === undefined) {
          setMessage(null);
        } else {
          setMessage("Ciao, ti contatto per il seguente problema: " + problemType);
        }

        const savedMessages = await getSupportMessages(chatId);
        setMessages(savedMessages);
      } catch (err) {
        console.error("Errore durante l'inizializzazione della chat:", err);
        setError("Errore durante l'inizializzazione della chat.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [chatId, mentoreId, userId, userType, navigate, problemType]); // Aggiunto mentoreId come dipendenza

 // Aggiunto mentoreId come dipendenza

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) {
      console.warn("Messaggio vuoto o chat non disponibile.");
      return;
    }

    try {
      const newMessage = {
        chatId,
        senderId: userId,
        text: message,
        timestamp: Date.now(),
      };

      await sendSupportMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Errore durante l'invio del messaggio:", err);
      setError("Errore durante l'invio del messaggio.");
    }
  };

  if (error) {
    useEffect(() => {
      const timer = setTimeout(() => navigate("/chat-list"), 3000);
      return () => clearTimeout(timer);
    }, [navigate]);

    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      <Header />
      <div className="container mx-auto py-6 space-y-6 text-white">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh] text-xl font-semibold animate-pulse">
            Caricamento in corso...
          </div>
        ) : (
          <>
            <Card className="w-full max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#178563] to-[#22A699] text-white py-6 px-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#178563] text-3xl font-bold">
                    {user.nome[0]}{user.cognome[0]}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-bold mb-1">
                      {userType === "mentor" ? "Profilo del Mentee" : "Profilo del Mentore"}
                    </h2>
                    <CardTitle className="text-2xl font-semibold">
                      {user.nome} {user.cognome}
                    </CardTitle>
                    <p className="text-lg font-medium">{user.occupazione}</p>
                    {problemType && problemType !== "Non specificato" && (
                      <p className="text-sm text-gray-200 mt-2">
                        Stai discutendo del problema: {problemType}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4">
              <div className="flex-1 overflow-y-auto border rounded-lg p-6 bg-gray-50 shadow-inner h-[500px]">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end mb-4 ${
                        msg.senderId === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.senderId !== userId && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#178563] to-[#22A699] flex items-center justify-center text-white text-sm font-bold mr-2">
                          {userType === "mentor" ? menteeName[0] : mentorName[0]}
                        </div>
                      )}
                      <div
                        className={`px-6 py-4 max-w-[75%] rounded-2xl shadow-md ${
                          msg.senderId === userId
                            ? "bg-[#22A699] text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="break-words text-lg">{msg.text}</p>
                        <span className="block text-xs mt-2 text-right opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {msg.senderId === userId && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#178563] to-[#22A699] flex items-center justify-center text-white text-sm font-bold ml-2">
                          TU
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center">Nessun messaggio disponibile.</div>
                )}
              </div>

              <div className="p-4 bg-gray-100 border-t flex items-center space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22A699] outline-none text-gray-900"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-[#22A699] to-[#178563] text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  Invia
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

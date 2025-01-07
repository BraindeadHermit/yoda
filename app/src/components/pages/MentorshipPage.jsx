import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { fetchMentorship, closeMentorshipSession } from "@/dao/mentorshipSessionDAO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar, MessageSquare, FileEdit, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";

const MentorshipPage = () => {
    const { userId, userType } = useAuth();
    const [mentorshipSessions, setMentorshipSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMentorshipSessions = async () => {
            if (userId) {
                try {
                    const sessions = await fetchMentorship(userId);
                    console.log("📌 Dati ricevuti da Firestore:", sessions);
                    setMentorshipSessions(sessions);
                } catch (error) {
                    alert("Errore nel caricamento delle sessioni mentorship:" + error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadMentorshipSessions();
    }, [userId]);

    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const handleScheduleClick = () => {
        const route = userType === "mentor" ? "/Calendar" : "/CalendarMentee";
        navigate(route);
    };

    const handleDetailClick = (session) => {
        const route = userType === "mentor" ? `/dettagli/${session.menteeId}` : `/dettagli/${session.mentoreId}`;
        navigate(route);
    };
    const handleMessageClick = (session) => {

        const chatId = session.chatId || null;
        const menteeId = session.menteeId;
        const mentoreId = session.mentoreId;
        const menteeNome = session.menteeNome;
        const mentoreNome = session.mentoreNome;

        navigate("/chat-support", {
            state: {
                chatId,
                menteeId,
                mentoreId,
                menteeNome,
                mentoreNome
            },
        });
    };

    const handleCloseSession = async (sessionId) => {
        try {
            await closeMentorshipSession(sessionId);
            setMentorshipSessions((prevSessions) =>
                prevSessions.map((session) =>
                    session.id === sessionId ? { ...session, stato: "Inattivo" } : session
                )
            );
        } catch (error) {
            alert("Errore nella chiusura della sessione:" + error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
                <p className="text-xl font-medium text-white animate-pulse">
                    Caricamento delle sessioni di mentorship...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
            <Header />
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">
                    Le Tue Sessioni di Mentorship
                </h1>
                <div className="bg-white shadow-lg rounded-lg p-8">
                    {mentorshipSessions.length > 0 ? (
                        <div className="space-y-6">
                            {mentorshipSessions.map((session) => {
                                const isMentee = userType === "mentee";
                                const displayName = isMentee
                                    ? `${session.mentoreNome} ${session.mentoreCognome}`
                                    : `${session.menteeNome} ${session.menteeCognome}`;
                                const displayLabel = isMentee ? "Mentore" : "Mentee";

                                const initials = displayName
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase();

                                return (
                                    <div
                                        key={session.id}
                                        className={`flex flex-col rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer bg-white border ${
    expandedCard === session.id ? "border-l-8 border-green-500" : "border-l-4 border-gray-200"
} p-6`}
                                    >
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleCard(session.id)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#178563] to-[#22A699] flex items-center justify-center text-white text-lg font-bold">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {displayLabel}: {displayName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Stato: {session.stato}
                                                    </p>
                                                </div>
                                            </div>
                                            {expandedCard === session.id ? (
                                                <ChevronUp className="h-6 w-6 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-6 w-6 text-gray-500" />
                                            )}
                                        </div>
                                        {expandedCard === session.id && (
                                            <div className="mt-4 space-y-4">
                                                <p className="text-gray-700 text-sm">
                                                    <strong>Data di Creazione:</strong> {session.createdAt?.seconds ? new Date(session.createdAt.seconds * 1000).toLocaleString() : "Data non disponibile"}
                                                </p>
                                                <div className="flex gap-4">
                                                    <button
                                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                                        onClick={handleScheduleClick}
                                                    >
                                                        <Calendar className="inline-block h-5 w-5 mr-2" />
                                                        Schedule
                                                    </button>
                                                    <button
                                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                        onClick={() => handleMessageClick(session)}
                                                    >
                                                        <MessageSquare className="inline-block h-5 w-5 mr-2" />
                                                        Message
                                                    </button>
                                                    <button
                                                        className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                                        onClick={() => handleDetailClick(session)}
                                                    >
                                                        <FileEdit className="inline-block h-5 w-5 mr-2" />
                                                        Details
                                                    </button>
                                                    {userType === "mentor" && session.stato === "Attiva" && (
                                                        <button
                                                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                            onClick={() => handleCloseSession(session.id)}
                                                        >
                                                            <XCircle className="inline-block h-5 w-5 mr-2" />
                                                            Chiudi
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-lg">
                            Nessuna sessione di mentorship trovata.
                        </p>
                    )}
                </div>
                <button
    onClick={() => navigate("/chat-list")}
    className="fixed bottom-8 right-8 z-50 flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 mr-2"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 16.938c0 2.485-3.582 4.5-8 4.5s-8-2.015-8-4.5M21 12.938c0 2.485-3.582 4.5-8 4.5s-8-2.015-8-4.5m16 0c0 2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5m16 0c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5"
        />
    </svg>
    Lista Chat
</button>

            </div>
        </div>
    );
};

export default MentorshipPage;


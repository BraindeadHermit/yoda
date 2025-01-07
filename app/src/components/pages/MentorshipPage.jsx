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
        return <p>Caricamento delle sessioni di mentorship...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-700 to-emerald-50">
            <Header />

            <div className="container px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Le Tue Sessioni di Mentorship</h1>
                <div className="space-y-4">
                    {mentorshipSessions.length > 0 ? (
                        mentorshipSessions.map((session) => {
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
                                <Card
                                    key={session.id}
                                    className={`transition-all duration-200 ${expandedCard === session.id ? "shadow-lg" : "shadow"
                                        }`}
                                >
                                    <CardHeader
                                        className="cursor-pointer"
                                        onClick={() => toggleCard(session.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-bold">
                                                    {initials}
                                                </div>
                                                <span className="font-medium">
                                                    {displayLabel}: {displayName}
                                                </span>
                                            </div>
                                            {expandedCard === session.id ? (
                                                <ChevronUp className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    {expandedCard === session.id && (
                                        <CardContent className="pt-0">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-emerald-700 mb-2">
                                                        Dettagli della Sessione
                                                    </h3>
                                                    <p>
                                                        <strong>Data di Creazione:</strong>{" "}
                                                        {session.createdAt?.seconds
                                                            ? new Date(session.createdAt.seconds * 1000).toLocaleString()
                                                            : "Data non disponibile"}
                                                    </p>
                                                    <p>
                                                        <strong>Stato:</strong> {session.stato}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 pt-4 border-t">
                                                    <Button variant="outline" className="flex-1" onClick={handleScheduleClick}>
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Schedule
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => handleMessageClick(session)}>
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Message
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => handleDetailClick(session)}
                                                    >
                                                        <FileEdit className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Button>
                                                    {userType === "mentor" && session.stato === "Attiva" && (
                                                        <Button
                                                            variant="destructive"
                                                            className="flex-1"
                                                            onClick={() => handleCloseSession(session.id)}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Chiudi Sessione
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-white">Nessuna sessione di mentorship trovata.</p>
                    )}
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
                        Chat Mentorship
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MentorshipPage;

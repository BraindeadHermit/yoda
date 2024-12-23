import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // Stato per memorizzare il tipo di utente
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); // Inizializza Firestore

  // Controlla lo stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Recupera i dettagli dell'utente da Firestore
          const userDocRef = doc(db, 'utenti', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserType(userData.userType); // Imposta il tipo di utente
          }
        } catch (error) {
          console.error('Errore nel recupero dei dettagli dell\'utente:', error);
        }
      } else {
        setUserType(null); // Se non c'è un utente loggato, resetta il tipo
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      navigate('/login', { state: { message: 'Logout effettuato con successo' } }); // Passa il messaggio
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <header className="bg-white border-b border-green-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo e Titolo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-[#178563]">Yoda</h1>
          </Link>
          <span className="ml-2 text-sm text-green-600">
            Piattaforma di Mentorship
          </span>
        </div>

        {/* Menu di navigazione */}
        <nav className="flex space-x-8">
          <Link
            to="/contents"
            className="text-sm text-green-700 hover:text-green-500 font-semibold tracking-wide uppercase"
          >
            CONTENUTI
          </Link>
          <Link
            to="/videos"
            className="text-sm text-green-700 hover:text-green-500 font-semibold tracking-wide uppercase"
          >
            VIDEO
          </Link>
          <Link
            to="/personal-area"
            className="text-sm text-green-700 hover:text-green-500 font-semibold tracking-wide uppercase"
          >
            AREA PERSONALE
          </Link>
        </nav>

        {/* Barra di ricerca */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca mentori, argomenti o video"
              className="w-full px-4 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#178563]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
          </div>
        </div>

        {/* Icone */}
        <div className="flex items-center space-x-4 relative">
          <Bell className="text-green-600 cursor-pointer" />

          {/* Menu dinamico per l'utente */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-green-600 cursor-pointer focus:outline-none"
            >
              <User />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-green-200 rounded-lg shadow-lg">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Profilo
                    </Link>

                    {/* Mostra opzioni diverse in base al tipo di utente */}
                    {userType === 'mentor' ? (
                      <>
                        <Link
                          to="/mentorship"
                          className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                        >
                          Mentorship
                        </Link>
                        <Link
                          to="/Calendar"
                          className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                        >
                          Calendario Meetings
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/sessions"
                          className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                        >
                          Sessioni Mentorship
                        </Link>
                      </>
                    )}

                    <Link
                      to="/portfolio"
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Portfolio
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Registrati
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

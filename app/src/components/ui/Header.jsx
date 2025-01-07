import { useState, useEffect } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Controlla lo stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login', { state: { message: 'Logout effettuato con successo' } }); // Passa il messaggio
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };


  const goToNotifications = () => {
      navigate('/notifiche');
    };


  return (
    <header className="bg-white border-b border-green-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-[#178563]">Yoda</h1>
          </Link>
          <span className="ml-2 text-sm text-green-600">
            Piattaforma di Mentorship
          </span>
        </div>

        {/* Icone */}
        <div className="flex items-center space-x-4 relative">
        <Bell 
            className="text-green-600 cursor-pointer" 
            onClick={goToNotifications} 
          /> 

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
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                    >
                      Impostazioni
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

          {/* Menu a tendina */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-green-600 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-green-200 rounded-lg shadow-lg">
                <Link
                  to="/contents"
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                >
                  CONTENUTI
                </Link>
                <Link
                  to="/videos"
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                >
                  VIDEO
                </Link>
                <Link
                  to="/personal-area"
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                >
                  AREA PERSONALE
                </Link>
                <Link
                  to="/support"
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                >
                  SUPPORTO
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

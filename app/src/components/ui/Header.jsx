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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (!prev) setIsDropdownOpen(false); // Chiude il dropdown se il menu utente viene aperto
      return !prev;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => {
      if (!prev) setIsMenuOpen(false); // Chiude il menu utente se il dropdown viene aperto
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login', { state: { message: 'Logout effettuato con successo' } });
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const goToNotifications = () => {
    navigate('/notifiche');
  };

  return (
    <header className="bg-gradient-to-r from-green-50 to-white border-b border-gray-200 shadow-sm px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-3xl font-extrabold text-green-700 tracking-tight">Yoda</h1>
          </Link>
          <span className="ml-3 text-sm text-gray-600 font-medium">
            Piattaforma di Mentorship
          </span>
        </div>

        {/* Icone */}
        <div className="flex items-center space-x-6 relative">
          <Bell
            className="text-green-700 cursor-pointer hover:scale-105 transition-transform"
            onClick={goToNotifications}
          />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-green-700 hover:text-green-900 focus:outline-none"
            >
              <User className="h-6 w-6" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-semibold">Profilo</span>
                    </Link>
                  
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-semibold">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-semibold">Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-semibold">Registrati</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-green-700 hover:text-green-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <Link
                  to="/contents"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold">Contenuti</span>
                </Link>
                <Link
                  to="/videos"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold">Video</span>
                </Link>
                <Link
                  to="/personal-area"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold">Area Personale</span>
                </Link>
                <Link
                  to="/support"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold">Supporto</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

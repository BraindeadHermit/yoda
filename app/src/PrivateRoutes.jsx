import React from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "@/auth/auth-context";

function PrivateRoutes({roles}) {
  const { isLogged, userType, nome, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    console.log("[PRIVATE ROUTES] Verifica in corso, caricamento...");
    return <div>Caricamento...</div>; // Indica che i dati di autenticazione sono in caricamento
  }
  if (isLogged === false) {
    console.log(roles.length)
    if (roles.length==0){
      console.log("[PRIVATE ROUTES] Accesso consentito per utenti non registrato");
      return <Outlet/>;
    }
    else {
      console.log("[PRIVATE ROUTES] Utente non loggato, reindirizzando a /login...");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  else {
    // Se l'utente è loggato, controlliamo se è nella home o in registrazione
    if (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login') {
     // Se è già loggato, redirigilo alla HomePageUtente
      return <Navigate to="/HomePageUtente" replace />;
        }
    if (!roles.includes(userType)) {
      console.log("[PRIVATE ROUTES] L\'utente non dispone dei permessi necessari");
      return <div>Non hai i permessi necessari</div>}
    else {  
      console.log("[PRIVATE ROUTES] Accesso consentito per l'utente: " + nome);
      return <Outlet />;}
  }
}

export default PrivateRoutes;


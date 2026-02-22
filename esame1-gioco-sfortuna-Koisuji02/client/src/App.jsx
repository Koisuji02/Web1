import "bootstrap/dist/css/bootstrap.min.css";
// ho messo tutti gli stili nella ./App.css per semplificare la sintassi nei vari componenti
import "./App.css";
import { useState, useEffect } from "react";

import DefaultLayout from "./components/DefaultLayout";
import HomePage from "./components/HomePage";
import { LoginForm } from "./components/AuthComponents";
import NotFound from "./components/NotFound";
import DemoPage from "./components/DemoPage";
import GamePage from "./components/GamePage";
import ProfilePage from "./components/ProfilePage";

import API from "./API/API.mjs";
import { Routes, Route, Navigate } from "react-router";

function App() {
  // STATO dell'utente autenticato (null se non loggato)
  const [user, setUser] = useState(null);
  // STATO per messaggi globali (es. login/logout/error)
  const [message, setMessage] = useState("");
  // STATO globale per sapere se il gioco è attivo (per disabilitare la navbar)
  const [gameActive, setGameActive] = useState(false);

  // useEffect: verifica la sessione utente all'avvio dell'applicazione
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo(); // chiamata API per verificare se utente è loggato
        setUser(userInfo);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Se sono su /game e non c'è partita attiva, riattivo la navbar (gestione REFRESH)
  useEffect(() => {
    if (window.location.pathname === "/game") {
      setGameActive(false);
    }
  }, []);

  // handler del login (passata al LoginForm)
  const handleLogin = async (credentials) => {
    try {
      const userInfo = await API.logIn(credentials); // chiamata API per login
      setUser(userInfo);
      setMessage({ msg: `Welcome, ${userInfo.username}!`, type: "success" });
    } catch (err) {
      setUser(null);
      setMessage({ msg: err.error || "Login failed", type: "danger" });
      throw err; // propaga l'errore al form
    }
  };

  // handler del logout (passata al NavHeader)
  const handleLogout = async () => {
    try {
      await API.logOut(); // chiamata API per logout
      setUser(null);
      setMessage({ msg: "Logout completed", type: "info" });
    } catch {
      setUser(null);
      setMessage({ msg: "Logout failed", type: "danger" });
    }
  };

  // <Routes> gestisce tutte le singole Route dell'applicazione
  // [<DefaultLayout> contiene la navbar e il container per gli alert]
  // route figlie vengono renderizzate tramite <Outlet /> in DefaultLayout
  return (
    <Routes>
      <Route
        element={
          <DefaultLayout
            user={user}
            handleLogout={handleLogout}
            message={message}
            setMessage={setMessage}
            gameActive={gameActive}
          /> }
      >
      {/* Home page: visibile a tutti */}
      <Route path="/" element={<HomePage user={user} />} />
      {/* Login: se già loggato, redirect a home; altrimenti al LoginForm */}
      <Route path="/login" element={
          user ? (
            <Navigate replace to="/" />
          ) : (
            <LoginForm handleLogin={handleLogin} />
          )
        } />
      {/* Demo: accessibile a tutti */}
      <Route path="/demo" element={<DemoPage API={API} />} />
      {/* Game: solo per utenti loggati, altrimenti redirect a login */}
      <Route path="/game" element={
        user ? (
          <GamePage API={API} user={user} navigate={(path) => window.location.assign(path)} onGameActiveChange={setGameActive} />
        ) : (
          <Navigate replace to="/login" />
        )
      } />
      {/* Profile: solo per utenti loggati */}
      <Route path="/profile" element={<ProfilePage API={API} user={user} />} />
      {/* Catch-all: pagina 404 custom */}
      <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

// src/App.jsx
import { useState } from "react";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home"; // Assuming this is your existing home page component

function App() {
  const [user, setUser] = useState(null); // Track user state

  const handleRegister = (userData) => {
    setUser(userData);
    // Optionally, save token to localStorage or state
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Optionally, save token to localStorage or state
  };

  return (
    <div>
      <Header user={user} />
      {!user ? (
        <>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;

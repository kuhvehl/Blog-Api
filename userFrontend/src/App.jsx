// src/App.jsx
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  const handleRegister = (token) => {
    const userData = jwtDecode(token);
    setUser(userData);
  };

  const handleLogin = (token) => {
    const userData = jwtDecode(token);
    setUser(userData);
  };

  return (
    <div>
      <Header user={user} />
      {!user ? (
        <>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </>
      ) : null}
      <Home />
    </div>
  );
}

export default App;

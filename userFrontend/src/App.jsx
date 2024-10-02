import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";

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
    <Router>
      <div>
        <Header user={user} />
        {!user ? (
          <>
            <Register onRegister={handleRegister} />
            <Login onLogin={handleLogin} />
          </>
        ) : null}
        <Routes>
          {" "}
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetails user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

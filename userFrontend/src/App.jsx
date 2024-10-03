import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token);
        // You can check or set the 'isAuthor' flag based on your application's logic
        userData.isAuthor = userData.isAuthor || false; // Adjust this logic if needed
        setUser(userData);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token"); // If token is invalid, remove it
      }
    }
  }, []);

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

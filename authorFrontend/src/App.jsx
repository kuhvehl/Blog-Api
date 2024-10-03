import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";
import CreatePost from "./components/CreatePost";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token);
        userData.isAuthor = userData.isAuthor || false;
        setUser(userData);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (token, isAuthor) => {
    localStorage.setItem("token", token);
    const userData = jwtDecode(token);
    userData.isAuthor = isAuthor;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <div>
        <Header user={user} onLogout={handleLogout} />
        {!user ? <Login onLogin={handleLogin} /> : null}
        <Routes>
          <Route
            path="/"
            element={user && user.isAuthor ? <Home user={user} /> : null}
          />
          <Route
            path="/create"
            element={user && user.isAuthor ? <CreatePost user={user} /> : null}
          />
          <Route
            path="/post/:id"
            element={user && user.isAuthor ? <PostDetails user={user} /> : null}
          />
          <Route
            path="/edit-post/:id"
            element={user && user.isAuthor ? <CreatePost user={user} /> : null}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

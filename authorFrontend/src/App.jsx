import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (token, isAuthor) => {
    const userData = jwtDecode(token);
    userData.isAuthor = isAuthor;
    setUser(userData);
  };

  return (
    <Router>
      <div>
        <Header user={user} />
        {!user ? <Login onLogin={handleLogin} /> : null}
        <Routes>
          <Route
            path="/"
            element={user && user.isAuthor ? <Home user={user} /> : null} // Pass user to Home
          />
          <Route path="/post/:id" element={<PostDetails user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

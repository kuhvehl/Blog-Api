import { useState } from "react";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://kuhvehl-blog-api.adaptable.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const decodedToken = jwtDecode(data.token);

      if (decodedToken.isAuthor) {
        localStorage.setItem("token", data.token);
        onLogin(data.token, decodedToken.isAuthor);
      } else {
        setErrorMessage("You are not a blogger.");
      }
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
    </form>
  );
};

export default Login;

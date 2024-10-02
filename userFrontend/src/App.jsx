import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header"; // Import the Header component

function App() {
  return (
    <Router>
      <Header /> {/* Display the header on every page */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Other routes like PostDetails will go here */}
      </Routes>
    </Router>
  );
}

export default App;

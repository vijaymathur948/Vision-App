import "./App.css";
import Login from "./components/Login";
import Home from "./container/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;

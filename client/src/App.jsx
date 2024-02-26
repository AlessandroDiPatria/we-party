import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/loginPage";
import Layout from "./components/layout/Layout";
import RegisterPage from "./pages/registerPage";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

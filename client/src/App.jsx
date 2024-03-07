import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/loginPage";
import Layout from "./components/layout/Layout";
import RegisterPage from "./pages/registerPage";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import ProfilePage from "./pages/accountPage";
import PlacesPage from "./pages/placePage";
import PlacesFormPage from "./pages/PlacesFromPages";
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
          <Route path="/account" element={<ProfilePage></ProfilePage>} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

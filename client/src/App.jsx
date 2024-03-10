import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/loginPage";
import Layout from "./components/layout/Layout";
import RegisterPage from "./pages/registerPage";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import ProfilePage from "./pages/accountPage";
import PlacePage from "./pages/PlacePage";
import PlacesFormPage from "./pages/PlacesFromPages";
import BookingsPage from "./pages/BookingsPage";
import PlacesPage from "./pages/placesPage";
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
          <Route path="/account/places" element={<PlacesPage></PlacesPage>} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings/:id" element={<BookingsPage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

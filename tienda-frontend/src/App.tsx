import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tienda from "./tienda/Tienda";
import Admin from "./admin/Admin";
import Login from "./login/Login";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
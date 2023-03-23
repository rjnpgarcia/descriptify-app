import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import STTPage from "./pages/STTPage";
import TTSPage from "./pages/TTSPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <MainLayout>
      <Routes>
        <Route
          index
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/speechtotext"
          element={isAuthenticated ? <STTPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/texttospeech"
          element={isAuthenticated ? <TTSPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginPage auth={setIsAuthenticated} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

// for Login
{
  /* <Route index element={ isAuthenticated? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/speechtotext" element={isAuthenticated? <STTPage /> : <Navigate to="/login" />} />
        <Route path="/texttospeech" element={isAuthenticated ? <TTSPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage auth={setIsAuthenticated}/>} /> */
}

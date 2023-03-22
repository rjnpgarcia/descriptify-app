import React from "react";
import { Routes, Route } from "react-router-dom";
import STTPage from "./pages/STTPage";
import TTSPage from "./pages/TTSPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/speechtotext" element={<STTPage />} />
        <Route path="/texttospeech" element={<TTSPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

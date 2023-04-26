import React, { useEffect } from "react";
import TextToSpeech from "../components/TextToSpeech.js";
// Components
import SubLayout from "../layouts/SubLayout.js";
import { useAuth } from "../contexts/AuthHandler.js";

const TTSPage = () => {
  const { pageStorageName } = useAuth();
  // To store if this is the last page visited. For browser refresh to stay in the page.
  useEffect(() => {
    localStorage.setItem(pageStorageName, "/texttospeech");
  }, [pageStorageName]);

  return (
    <SubLayout>
      <TextToSpeech />
    </SubLayout>
  );
};

export default TTSPage;

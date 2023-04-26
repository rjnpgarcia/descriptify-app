import React, { useEffect } from "react";
import SpeechToText from "../components/SpeechToText.js";
// Components
import SubLayout from "../layouts/SubLayout.js";
import { ScreenLoaderHandler } from "../contexts/ScreenLoaderHandler.js";
import { useAuth } from "../contexts/AuthHandler.js";

const STTPage = () => {
  const { pageStorageName } = useAuth();
  // To store if this is the last page visited. For browser refresh to stay in the page.
  useEffect(() => {
    localStorage.setItem(pageStorageName, "/speechtotext");
  }, [pageStorageName]);

  return (
    <SubLayout>
      <ScreenLoaderHandler>
        <SpeechToText />
      </ScreenLoaderHandler>
    </SubLayout>
  );
};

export default STTPage;

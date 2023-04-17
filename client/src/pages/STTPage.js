import React from "react";
import SpeechToText from "../components/SpeechToText.js";
// Components
import SubLayout from "../layouts/SubLayout.js";
import { ScreenLoaderHandler } from "../contexts/ScreenLoaderHandler.js";

const STTPage = () => {
  return (
    <SubLayout>
      <ScreenLoaderHandler>
        <SpeechToText />
      </ScreenLoaderHandler>
    </SubLayout>
  );
};

export default STTPage;

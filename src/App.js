import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";

import ChatBot from './components/ChatBot';


function App() {
  return (
    <div className="App">
      <ThirdwebProvider>
        <ChatBot />
      </ThirdwebProvider>
    </div>
  );
}

export default App;
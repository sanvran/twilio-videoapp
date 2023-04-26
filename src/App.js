import React from "react";
import "./App.css";
import VideoChat from "./VideoChat";

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Virtual Video Visit </h1>
      </header>
      <main>
        <VideoChat />
      </main>
      <footer>

        <h5>Alento Inc</h5>

      </footer>
    </div>
  );
};

export default App;